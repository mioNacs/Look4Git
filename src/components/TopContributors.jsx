  return (
    <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-white shadow'}`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <svg className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
        Top Contributors
      </h2>
    </div>
  ); 