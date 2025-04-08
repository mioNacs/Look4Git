import { useState } from 'react';
import { BookOpenIcon, ArrowUpIcon, ArrowDownIcon, FolderIcon } from '@heroicons/react/24/outline';
import RepoCard from './RepoCard';

const AllRepositories = ({ repos, darkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reposPerPage] = useState(6);
  const [sortOption, setSortOption] = useState('stars');
  const [sortDirection, setSortDirection] = useState('desc');

  if (!repos) {
    return null;
  }

  // Sort repositories based on selected option
  const sortedRepos = [...repos].sort((a, b) => {
    let comparison = 0;
    switch (sortOption) {
      case 'stars':
        comparison = b.stargazers_count - a.stargazers_count;
        break;
      case 'forks':
        comparison = b.forks_count - a.forks_count;
        break;
      case 'updated':
        comparison = new Date(b.updated_at) - new Date(a.updated_at);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      default:
        comparison = b.stargazers_count - a.stargazers_count;
    }
    return sortDirection === 'desc' ? comparison : -comparison;
  });

  // Pagination
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = sortedRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(sortedRepos.length / reposPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  if (repos.length === 0) {
    return (
      <div className={`rounded-xl p-8 text-center border ${
        darkMode ? 'bg-surface border-border text-text-secondary' : 'bg-white border-gray-100 text-gray-500'
      }`}>
        <FolderIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center">
            <BookOpenIcon className={`w-6 h-6 mr-3 ${darkMode ? 'text-primary-light' : 'text-primary'}`} />
            <h2 className="text-xl md:text-2xl font-display font-bold text-text">
              All Repositories
              <span className="ml-2 font-normal text-text-secondary text-sm md:text-base">
                ({repos.length})
              </span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-text-secondary text-sm hidden sm:inline">Sort by:</label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={`pl-3 pr-8 py-2 rounded-md border appearance-none text-sm ${
                    darkMode 
                      ? 'bg-gray-900 border-border text-text focus:border-primary-light' 
                      : 'bg-white border-gray-200 text-gray-700 focus:border-primary'
                  }`}
                >
                  <option value="stars">Stars</option>
                  <option value="forks">Forks</option>
                  <option value="updated">Updated</option>
                  <option value="name">Name</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              onClick={toggleSortDirection}
              className={`p-2 rounded-md border transition-colors ${
                darkMode 
                  ? 'bg-surface border-border hover:bg-gray-800 text-text-secondary' 
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500'
              }`}
              aria-label={`Sort ${sortDirection === 'desc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'desc' ? (
                <ArrowDownIcon className="w-4 h-4" />
              ) : (
                <ArrowUpIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Repository list */}
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {currentRepos.map((repo, index) => (
            <div key={repo.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <RepoCard repo={repo} isTopRepo={false} darkMode={darkMode} />
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-1">
              {/* Previous page button */}
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded-md transition-colors disabled:opacity-40 ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-text-secondary disabled:text-gray-700' 
                    : 'hover:bg-gray-100 text-gray-600 disabled:text-gray-300'
                }`}
                aria-label="Previous page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${
                      currentPage === number
                        ? darkMode
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-200 text-black'
                        : darkMode
                          ? 'text-text-secondary hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              {/* Next page button */}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded-md transition-colors disabled:opacity-40 ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-text-secondary disabled:text-gray-700' 
                    : 'hover:bg-gray-100 text-gray-600 disabled:text-gray-300'
                }`}
                aria-label="Next page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRepositories; 