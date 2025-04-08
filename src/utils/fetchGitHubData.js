import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

// Create axios instance with default headers
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  }
});

// Add authentication if token is available
if (import.meta.env.VITE_GITHUB_TOKEN) {
  githubApi.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;
}

export const fetchUserData = async (username) => {
  try {
    const response = await githubApi.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add an authentication token.');
    }
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};

export const fetchLatestCommit = async (username, repoName) => {
  try {
    const response = await githubApi.get(`/repos/${username}/${repoName}/commits?per_page=1`);
    return response.data[0]?.commit?.message || '';
  } catch (error) {
    console.error(`Error fetching latest commit for ${repoName}:`, error);
    return ''; // Return empty string on error
  }
};

export const fetchUserReposWithCommits = async (username) => {
  try {
    // First fetch the repos
    const response = await githubApi.get(`/users/${username}/repos?sort=stars&per_page=100`);
    const repos = response.data;
    
    // Get only top 5 repos by stars for commit messages
    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);
    
    // Process top repos in chunks to avoid rate limiting
    const chunkSize = 5;
    const chunks = [];
    
    for (let i = 0; i < topRepos.length; i += chunkSize) {
      chunks.push(topRepos.slice(i, i + chunkSize));
    }
    
    // Create a copy of all repos
    const reposWithCommits = [...repos];
    
    // Fetch latest commit only for top repos in chunks
    for (const chunk of chunks) {
      const commitPromises = chunk.map(repo => fetchLatestCommit(username, repo.name));
      const commitMessages = await Promise.all(commitPromises);
      
      // Add commit messages to the repos
      chunk.forEach((repo, index) => {
        const repoIndex = repos.findIndex(r => r.id === repo.id);
        if (repoIndex !== -1) {
          reposWithCommits[repoIndex].latestCommit = commitMessages[index];
        }
      });
    }
    
    return reposWithCommits;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add an authentication token.');
    }
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};

export const fetchUserRepos = async (username) => {
  try {
    const response = await githubApi.get(`/users/${username}/repos?sort=stars&per_page=100`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add an authentication token.');
    }
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};

export const fetchRepoLanguages = async (username, repoName) => {
  try {
    const response = await githubApi.get(`/repos/${username}/${repoName}/languages`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add an authentication token.');
    }
    throw new Error(`Failed to fetch languages: ${error.message}`);
  }
};

export const calculateLanguageStats = async (username) => {
  try {
    const repos = await fetchUserRepos(username);
    const languageStats = {};
    const languageRepoCount = {};
    
    // Limit to top 25 repositories by stars to avoid too many API calls
    const topRepos = repos
      .filter(repo => !repo.fork) // Exclude forks
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 25);
    
    // Fetch languages for each repo in parallel, with a concurrency limit
    const chunkSize = 5; // Process 5 repos at a time to avoid rate limiting
    const chunks = [];
    
    for (let i = 0; i < topRepos.length; i += chunkSize) {
      chunks.push(topRepos.slice(i, i + chunkSize));
    }
    
    for (const chunk of chunks) {
      const languagePromises = chunk.map(repo => fetchRepoLanguages(username, repo.name));
      const results = await Promise.all(languagePromises);
      
      results.forEach((languages, index) => {
        const repoName = chunk[index].name;
        
        for (const [language, bytes] of Object.entries(languages)) {
          // Track bytes for each language
          languageStats[language] = (languageStats[language] || 0) + bytes;
          
          // Track which repos use each language (for counting repos per language)
          if (!languageRepoCount[language]) {
            languageRepoCount[language] = new Set();
          }
          languageRepoCount[language].add(repoName);
        }
      });
    }
    
    // Convert Sets to counts
    const languageRepoCountNumbers = {};
    for (const [language, repoSet] of Object.entries(languageRepoCount)) {
      languageRepoCountNumbers[language] = repoSet.size;
    }
    
    return {
      bytesPerLanguage: languageStats,
      reposPerLanguage: languageRepoCountNumbers
    };
  } catch (error) {
    console.error('Error calculating language stats:', error);
    return {
      bytesPerLanguage: {},
      reposPerLanguage: {}
    }; // Return empty objects on error
  }
}; 