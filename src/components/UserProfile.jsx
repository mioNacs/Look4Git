import { 
  UserIcon, 
  MapPinIcon, 
  LinkIcon, 
  UsersIcon, 
  BuildingOfficeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const UserProfile = ({ userData, darkMode }) => {
  // Easter egg for 'mioNacs' username
  const isMioNacs = userData.login.toLowerCase() === 'mionacs';
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate years since joining
  const joinedYears = () => {
    const joined = new Date(userData.created_at);
    const now = new Date();
    return Math.floor((now - joined) / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <div className={`h-full relative overflow-hidden ${
      darkMode ? 'bg-surface' : 'bg-white'
    } rounded-xl shadow-lg border ${
      darkMode ? 'border-border' : 'border-gray-100'
    } ${isMioNacs ? 'border-2 border-purple-500' : ''}`}>
      
      {/* Background header with gradient */}
      <div className={`h-40 bg-gradient-to-r ${
        darkMode 
          ? `${isMioNacs ? 'from-purple-900 to-indigo-800' : 'from-blue-900 to-indigo-800'}` 
          : `${isMioNacs ? 'from-purple-400 to-indigo-500' : 'from-blue-400 to-blue-600'}`
      }`}></div>
      
      {/* Content section with avatar overlapping the banner */}
      <div className="px-6 pb-6 pt-0 -mt-20">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center mb-8">
          <div className={`relative ${isMioNacs ? 'animate-floating' : ''}`}>
            <div className={`w-36 h-36 rounded-full overflow-hidden border-4 shadow-lg ${
              darkMode 
                ? `${isMioNacs ? 'border-purple-500' : 'border-surface'}` 
                : `${isMioNacs ? 'border-purple-500' : 'border-white'}`
            }`}>
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-full h-full object-cover"
              />
            </div>
            {userData.hireable && (
              <span className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Hireable
              </span>
            )}
          </div>
          
          {/* Name and username - centered */}
          <div className="text-center mt-4">
            <h2 className={`text-2xl md:text-3xl font-display font-bold ${darkMode ? 'text-text' : 'text-gray-800'} ${isMioNacs ? 'text-purple-500' : ''}`}>
              {userData.name || userData.login}
              {isMioNacs && ' ✨'}
            </h2>
            <p className="text-text-secondary text-lg">@{userData.login}</p>
          </div>
        </div>

        {/* Stats cards in a row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard 
            label="Followers" 
            value={userData.followers} 
            darkMode={darkMode}
            primaryColor={isMioNacs ? 'text-purple-500' : null}
          />
          <StatCard 
            label="Following" 
            value={userData.following} 
            darkMode={darkMode}
            primaryColor={isMioNacs ? 'text-purple-500' : null}  
          />
          <StatCard 
            label="Repos" 
            value={userData.public_repos} 
            darkMode={darkMode}
            primaryColor={isMioNacs ? 'text-purple-500' : null}
          />
        </div>

        {/* Bio - centered */}
        {userData.bio && (
          <div className="mb-8 text-center">
            <p className="text-text">{userData.bio}</p>
          </div>
        )}
        
        {/* User details in a grid */}
        <div className="grid grid-cols-1 gap-4 text-text-secondary">
          {userData.company && (
            <div className="flex items-center justify-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              <span>{userData.company}</span>
            </div>
          )}
          
          {userData.location && (
            <div className="flex items-center justify-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{userData.location}</span>
            </div>
          )}
          
          {userData.blog && (
            <div className="flex items-center justify-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              <a 
                href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline ${darkMode ? 'text-primary-light' : 'text-primary'}`}
              >
                {userData.blog}
              </a>
            </div>
          )}
          
          {userData.created_at && (
            <div className="flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>Joined {formatDate(userData.created_at)} ({joinedYears()} years)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for stats
const StatCard = ({ label, value, darkMode, primaryColor = null }) => {
  const formattedValue = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
  const colorClass = primaryColor || (darkMode ? 'text-primary-light' : 'text-primary');
  
  return (
    <div className={`rounded-lg ${darkMode ? 'bg-surface/80' : 'bg-gray-50'} border ${
      darkMode ? 'border-border' : 'border-gray-100'
    } p-4 text-center transition-transform hover:scale-105`}>
      <div className={`text-2xl font-bold ${colorClass}`}>{formattedValue}</div>
      <div className="text-text-secondary text-sm">{label}</div>
    </div>
  );
};

export default UserProfile; 