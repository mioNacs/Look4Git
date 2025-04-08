import { useState } from 'react';
import { StarIcon, FireIcon } from '@heroicons/react/24/outline';
import RepoCard from './RepoCard';

const TopRepositories = ({ repos, darkMode }) => {
  // Get the top 5 repos by star count
  const topRepos = repos
    ? [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
    : [];

  if (!repos) {
    return null;
  }

  if (topRepos.length === 0) {
    return (
      <div className={`rounded-xl p-8 text-center border ${
        darkMode ? 'bg-surface border-border text-text-secondary' : 'bg-white border-gray-100 text-gray-500'
      }`}>
        <FireIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No repositories found</p>
        <p className="text-sm mt-1">This user doesn't have any public repositories yet.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${
      darkMode ? 'bg-surface border-border' : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center">
          <StarIcon className={`w-6 h-6 mr-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <h2 className="text-xl md:text-2xl font-display font-bold text-text">
            Top Repositories
          </h2>
        </div>
        <p className="mt-1 text-text-secondary text-sm ml-9">
          Highest starred projects by this developer
        </p>
      </div>
      
      {/* Repos grid with cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 gap-4">
          {topRepos.map((repo, index) => (
            <div key={repo.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <RepoCard repo={repo} isTopRepo={true} darkMode={darkMode} />
            </div>
          ))}
        </div>
        
        {/* Hover hint */}
        <div className={`mt-4 text-center text-sm ${darkMode ? 'text-text-secondary' : 'text-gray-500'}`}>
          <span className="inline-flex items-center">
            <span className="mr-1">✨</span>
            <span>Hover over cards to see latest commit messages</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopRepositories; 