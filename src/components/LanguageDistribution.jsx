  return (
    <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-white shadow'}`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <svg className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
        Language Distribution
      </h2>
    </div>
  ); 