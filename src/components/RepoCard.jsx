import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { StarIcon, CodeBracketIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const RepoCard = ({ repo, isTopRepo = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced language color mapping
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      Java: '#b07219',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Rust: '#dea584',
      Dart: '#00B4AB',
    };
    
    return colors[language] || '#3366CC';
  };

  // Only top repos should have hover effects and commit data display
  const shouldShowCommit = isTopRepo && !!repo.latestCommit;

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-300
        bg-white dark:bg-surface border-gray-100 dark:border-border
        ${isTopRepo ? 'shadow-lg hover:shadow-xl' : 'shadow-sm hover:shadow'}
        ${isTopRepo && 'hover:-translate-y-0.5'}`}
      onMouseEnter={isTopRepo ? () => setIsHovered(true) : undefined}
      onMouseLeave={isTopRepo ? () => setIsHovered(false) : undefined}
    >
      <div className="p-5">
        {/* Repository header with name and badge */}
        <div className="flex justify-between items-start mb-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-display font-semibold hover:underline group flex items-center gap-1.5 
              text-gray-900 hover:text-primary dark:text-white dark:hover:text-primary-light"
          >
            <CodeBracketIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>{repo.name}</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          
          {isTopRepo && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
              Top Repo
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {repo.description || 'No description available'}
        </p>
        
        {/* Stats section */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {/* Language */}
          {repo.language && (
            <div className="flex items-center">
              <span 
                className="w-2.5 h-2.5 rounded-full mr-1.5"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              ></span>
              <span>{repo.language}</span>
            </div>
          )}
          
          {/* Stars */}
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 mr-1 text-yellow-500 dark:text-yellow-400" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          
          {/* Forks */}
          <div className="flex items-center">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
          
          {/* Updated */}
          <div className="flex items-center ml-auto">
            <ClockIcon className="w-3.5 h-3.5 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Latest commit section with transition - only for top repos */}
      {shouldShowCommit && (
        <div 
          className={`px-5 py-3 border-t overflow-hidden transition-all duration-300
            border-gray-100 bg-gray-50/80 dark:border-border dark:bg-surface/50
            ${isHovered ? 'max-h-20' : 'max-h-0 border-t-0'}`}
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium">Latest commit:</span> {repo.latestCommit}
          </p>
        </div>
      )}
    </div>
  );
};

export default RepoCard; 