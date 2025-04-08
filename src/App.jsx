import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import UserProfile from './components/UserProfile'
import ContributionCalendar from './components/ContributionCalendar'
import TopRepositories from './components/TopRepositories'
import AllRepositories from './components/AllRepositories'
import LanguageChart from './components/LanguageChart'
import { fetchUserData, fetchUserReposWithCommits, calculateLanguageStats } from './utils/fetchGitHubData'
import logoLight from './assets/svg/look4git-logo-new.svg'
import logoDark from './assets/svg/look4git-logo-new-dark.svg'

function App() {
  const [username1, setUsername1] = useState('')
  const [username2, setUsername2] = useState('')
  const [userData1, setUserData1] = useState(null)
  const [userData2, setUserData2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [animateSection, setAnimateSection] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.remove('dark-mode')
    }
  }, [darkMode])

  // Show animation when data is loaded
  useEffect(() => {
    if (userData1 || userData2) {
      setAnimateSection(true)
    }
  }, [userData1, userData2])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!username1) return

    setLoading(true)
    setError(null)
    setAnimateSection(false)

    try {
      const [user, repos, languageStats] = await Promise.all([
        fetchUserData(username1),
        fetchUserReposWithCommits(username1),
        calculateLanguageStats(username1)
      ])

      setUserData1({
        ...user,
        repos,
        languageStats
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = async (e) => {
    e.preventDefault()
    if (!username1 || !username2) return

    setLoading(true)
    setError(null)
    setAnimateSection(false)
    setCompareMode(true)

    try {
      const [user1, repos1, languageStats1] = await Promise.all([
        fetchUserData(username1),
        fetchUserReposWithCommits(username1),
        calculateLanguageStats(username1)
      ])

      const [user2, repos2, languageStats2] = await Promise.all([
        fetchUserData(username2),
        fetchUserReposWithCommits(username2),
        calculateLanguageStats(username2)
      ])

      setUserData1({
        ...user1,
        repos: repos1,
        languageStats: languageStats1
      })

      setUserData2({
        ...user2,
        repos: repos2,
        languageStats: languageStats2
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Easter egg for 'mioNacs' username
  const isEasterEgg = username1.toLowerCase() === 'mionacs' || username2.toLowerCase() === 'mionacs'

  return (
    <div className={`min-h-screen bg-background transition-all duration-300`}>
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 right-0 w-1/3 h-1/3 rounded-full ${darkMode ? 'bg-primary-dark/5' : 'bg-primary-light/5'} blur-3xl transform -translate-y-1/2 translate-x-1/3`}></div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full ${darkMode ? 'bg-primary/5' : 'bg-primary-light/5'} blur-3xl transform translate-y-1/4 -translate-x-1/4`}></div>
      </div>

      <div className="relative z-10">
        {/* Header with glass effect */}
        <header className={`sticky top-0 z-50 
          ${darkMode 
            ? 'bg-slate-900/75 border-gray-800' 
            : 'bg-white/75 border-gray-200'
          } 
          backdrop-blur border-b px-6 py-4 transition-all duration-300`}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={darkMode ? logoDark : logoLight} 
                alt="Look4Git Logo" 
                className="w-10 h-10 mr-2"
                style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.3))' }}
              />
              <h1 className="text-2xl sm:text-3xl font-display font-bold">
                <span className={`${darkMode ? 'text-primary-light' : 'text-primary'}`}>Look4</span>
                <span className="text-text">Git</span>
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                ? 'bg-surface/80 hover:bg-surface text-primary-light' 
                : 'bg-surface hover:bg-gray-100 text-primary shadow-sm'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10">
          {/* Hero search section - Only show welcome message if no user data */}
          <section className={`transition-all duration-300 ${(userData1 || userData2) ? 'mb-8' : 'max-w-3xl mx-auto text-center mb-16'}`}>
            {!(userData1 || userData2) && (
              <>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text">
                  Discover GitHub Profiles
                </h2>
                <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                  Enter GitHub usernames to visualize their activity, repositories, and contributions in a beautiful interface.
                </p>
              </>
            )}

            <div className={`relative ${(userData1 || userData2) ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}>
              <form onSubmit={compareMode ? handleCompare : handleSearch} className="space-y-4">
                <div className="relative flex">
                  <input
                    type="text"
                    value={username1}
                    onChange={(e) => setUsername1(e.target.value)}
                    placeholder="Enter first GitHub username"
                    className={`w-full px-6 py-4 pr-36 rounded-full border shadow-sm outline-none text-lg transition-all
                      ${darkMode 
                        ? 'bg-surface/70 border-border focus:border-primary-light text-gray-800 placeholder-text-secondary/50' 
                        : 'bg-white border-gray-200 focus:border-primary text-gray-800 placeholder-gray-400'
                      } ${isEasterEgg ? 'animate-pulse' : ''}`}
                  />
                </div>
                
                {compareMode && (
                  <div className="relative flex">
                    <input
                      type="text"
                      value={username2}
                      onChange={(e) => setUsername2(e.target.value)}
                      placeholder="Enter second GitHub username"
                      className={`w-full px-6 py-4 pr-36 rounded-full border shadow-sm outline-none text-lg transition-all
                        ${darkMode 
                          ? 'bg-surface/70 border-border focus:border-primary-light text-gray-800 placeholder-text-secondary/50' 
                          : 'bg-white border-gray-200 focus:border-primary text-gray-800 placeholder-gray-400'
                        } ${isEasterEgg ? 'animate-pulse' : ''}`}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-6 py-4 rounded-full transition-all
                      ${darkMode 
                        ? `bg-blue-500 hover:bg-blue-700 text-white` 
                        : `bg-blue-500 hover:bg-blue-700 text-white`
                      } ${isEasterEgg ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                        <span>{compareMode ? 'Compare' : 'Search'}</span>
                      </div>
                    )}
                  </button>

                  {!compareMode && (
                    <button
                      type="button"
                      onClick={() => setCompareMode(true)}
                      className={`px-6 py-4 rounded-full transition-all
                        ${darkMode 
                          ? 'bg-surface/80 hover:bg-surface text-primary-light' 
                          : 'bg-surface hover:bg-gray-100 text-primary shadow-sm'
                        }`}
                    >
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 mr-1" />
                        <span>Compare</span>
                      </div>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div className={`max-w-3xl mx-auto mb-12 p-4 rounded-lg border border-red-300 animate-fade-in
              ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-600'}`
            }>
              <p>{error}</p>
            </div>
          )}

          {/* Dashboard sections with animated entry */}
          {(userData1 || userData2) && (
            <div className={`space-y-8 ${animateSection ? 'animate-fade-in' : 'opacity-0'}`}>
              {/* Profile and Language Distribution side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {userData1 && (
                  <div className="animate-slide-up animation-delay-100 h-full">
                    <UserProfile userData={userData1} darkMode={darkMode} />
                  </div>
                )}
                
                {userData2 && (
                  <div className="animate-slide-up animation-delay-200 h-full">
                    <UserProfile userData={userData2} darkMode={darkMode} />
                  </div>
                )}
              </div>

              {/* Language Distribution comparison */}
              {compareMode && userData1 && userData2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="animate-slide-up animation-delay-300 h-full">
                    <div className={`h-full rounded-xl overflow-hidden shadow-lg ${
                      darkMode ? 'bg-surface' : 'bg-white'
                    } border ${darkMode ? 'border-border' : 'border-gray-100'}`}>
                      <h3 className="text-xl font-display font-bold mb-6 p-6 text-text">Language Distribution - {userData1.login}</h3>
                      <div className="px-6 pb-6">
                        <LanguageChart languageStats={userData1.languageStats} darkMode={darkMode} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="animate-slide-up animation-delay-400 h-full">
                    <div className={`h-full rounded-xl overflow-hidden shadow-lg ${
                      darkMode ? 'bg-surface' : 'bg-white'
                    } border ${darkMode ? 'border-border' : 'border-gray-100'}`}>
                      <h3 className="text-xl font-display font-bold mb-6 p-6 text-text">Language Distribution - {userData2.login}</h3>
                      <div className="px-6 pb-6">
                        <LanguageChart languageStats={userData2.languageStats} darkMode={darkMode} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contribution Calendar comparison */}
              {compareMode && userData1 && userData2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="animate-slide-up animation-delay-500">
                    <ContributionCalendar username={userData1.login} darkMode={darkMode} />
                  </div>
                  <div className="animate-slide-up animation-delay-600">
                    <ContributionCalendar username={userData2.login} darkMode={darkMode} />
                  </div>
                </div>
              )}

              {/* Repositories comparison */}
              {compareMode && userData1 && userData2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="animate-slide-up animation-delay-700">
                    <TopRepositories repos={userData1.repos} darkMode={darkMode} />
                  </div>
                  <div className="animate-slide-up animation-delay-800">
                    <TopRepositories repos={userData2.repos} darkMode={darkMode} />
                  </div>
                </div>
              )}

              {/* Single user view */}
              {!compareMode && userData1 && (
                <>
                  <div className="animate-slide-up animation-delay-300">
                    <ContributionCalendar username={userData1.login} darkMode={darkMode} />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="animate-slide-up animation-delay-400">
                      <TopRepositories repos={userData1.repos} darkMode={darkMode} />
                    </div>
                    <div className="animate-slide-up animation-delay-500">
                      <AllRepositories repos={userData1.repos} darkMode={darkMode} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* Modern footer */}
        <footer className={`mt-20 py-8 ${darkMode ? 'bg-surface/30' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 text-center">
            <p className="text-text-secondary text-sm">
              Look4Git | GitHub Activity Visualizer | Built with 💙 using React & Tailwind
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
