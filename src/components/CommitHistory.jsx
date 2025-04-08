  return (
    <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-white shadow'}`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <svg className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path>
        </svg>
        Commit History
      </h2>
    </div>
  ); 