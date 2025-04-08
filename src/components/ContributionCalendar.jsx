import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CalendarIcon, ArrowPathIcon, ChartBarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchContributionData } from '../utils/fetchGitHubData';

const ContributionCalendar = ({ username, darkMode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'linechart'
  const [contributionData, setContributionData] = useState([]);
  const imgRef = useRef(null);
  const chartUrlRef = useRef('');
  
  // Update the chart URL when username or darkMode changes
  useEffect(() => {
    if (!username) return;
    
    // Update chart URL for the calendar view
    const themeColor = darkMode ? '60a5fa' : '3b82f6';
    chartUrlRef.current = `https://ghchart.rshah.org/${themeColor}/${username}`;
    
    // If we already have an image element, update its src
    if (imgRef.current) {
      imgRef.current.src = chartUrlRef.current;
    }
  }, [username, darkMode]);
  
  // Fetch contribution data when username changes (not on darkMode changes)
  useEffect(() => {
    const getContributionData = async () => {
      if (!username) return;
      
      setLoading(true);
      setError(false);
      setRetryCount(0);
      
      try {
        const data = await fetchContributionData(username);
        setContributionData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contribution data:', err);
        setError(true);
        setLoading(false);
      }
    };
    
    getContributionData();
  }, [username]);

  const handleRetry = () => {
    if (retryCount < 3) {
      setLoading(true);
      setError(false);
      setRetryCount(prev => prev + 1);
      
      // Force reload the image
      if (imgRef.current) {
        const newUrl = `${chartUrlRef.current}?retry=${Date.now()}`;
        imgRef.current.src = newUrl;
      }
    }
  };

  // Toggle between calendar and line chart view
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'calendar' ? 'linechart' : 'calendar');
  };

  // Format date for tooltip
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total contributions using useMemo for performance
  const totalContributions = useMemo(() => {
    return contributionData.reduce((sum, item) => sum + item.contributions, 0);
  }, [contributionData]);

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded-md shadow-md ${darkMode ? 'bg-surface text-white border border-border' : 'bg-white text-gray-800 border border-gray-200'}`}>
          <p className="font-medium">{formatDate(label)}</p>
          <p className={`text-sm ${darkMode ? 'text-primary-light' : 'text-primary'}`}>
            <span className="font-medium">{payload[0].value}</span> contributions
          </p>
        </div>
      );
    }
    return null;
  };

  if (!username) {
    return null;
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${
      darkMode ? 'bg-surface border-border' : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className={`w-6 h-6 mr-3 ${darkMode ? 'text-primary-light' : 'text-primary'}`} />
            <h2 className="text-xl md:text-2xl font-display font-bold text-text">
              Contribution Activity
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {error && retryCount < 3 && (
              <button 
                onClick={handleRetry}
                className={`flex items-center text-sm px-3 py-1 rounded-full ${
                  darkMode ? 'bg-surface hover:bg-gray-800 text-primary-light' : 'bg-gray-100 hover:bg-gray-200 text-primary'
                }`}
              >
                <ArrowPathIcon className="w-4 h-4 mr-1" />
                Retry
              </button>
            )}
            
            {/* View toggle button */}
            <button
              onClick={toggleViewMode}
              className={`flex items-center text-sm px-3 py-1 rounded-full ${
                darkMode 
                  ? 'bg-surface hover:bg-gray-800 text-primary-light' 
                  : 'bg-gray-100 hover:bg-gray-200 text-primary'
              }`}
              aria-label={viewMode === 'calendar' ? "Switch to line chart view" : "Switch to calendar view"}
            >
              {viewMode === 'calendar' ? (
                <>
                  <ChartBarIcon className="w-4 h-4 mr-1" />
                  <span>Line View</span>
                </>
              ) : (
                <>
                  <CalendarDaysIcon className="w-4 h-4 mr-1" />
                  <span>Calendar View</span>
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-1 text-text-secondary text-sm ml-9">
          {viewMode === 'calendar' 
            ? "GitHub contribution calendar showing activity over the past year" 
            : "Contribution activity over time showing commit frequency"}
        </p>
      </div>
      
      {/* Chart container */}
      <div className={`px-6 py-4 ${darkMode ? 'bg-surface/50' : 'bg-gray-50/50'}`}>
        <div className="flex justify-center overflow-x-auto">
          <div className={`relative min-w-full rounded-lg ${darkMode ? 'bg-surface p-3' : 'bg-white/80 p-3 shadow-sm'}`}>
            {/* Loading skeleton */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <div className="text-text-secondary text-sm">Loading contribution data...</div>
                </div>
              </div>
            )}
            
            {/* Calendar view */}
            {viewMode === 'calendar' && !loading && !error && (
              <img 
                ref={imgRef}
                src={chartUrlRef.current}
                alt={`${username}'s GitHub contribution calendar`}
                className={`w-full relative z-20 transition-opacity duration-300 rounded ${loading ? 'opacity-30' : darkMode ? 'opacity-90' : 'opacity-100'}`}
                onLoad={() => {
                  setLoading(false);
                }}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                style={{ display: error ? 'none' : 'block' }}
              />
            )}
            
            {/* Line chart view */}
            {viewMode === 'linechart' && !loading && !error && (
              <div className="w-full h-80 relative z-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={contributionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 
                    />
                    <XAxis 
                      dataKey="date" 
                      label={{ 
                        value: 'Date', 
                        position: 'insideBottomRight', 
                        offset: -10,
                        fill: darkMode ? '#9ca3af' : '#6b7280' 
                      }}
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                      interval={Math.floor(contributionData.length / 10)}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Contributions', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: darkMode ? '#9ca3af' : '#6b7280' 
                      }}
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke={darkMode ? '#60a5fa' : '#3b82f6'}
                      strokeWidth={2}
                      dot={{ r: 1, fill: darkMode ? '#60a5fa' : '#3b82f6' }}
                      activeDot={{ r: 4, fill: darkMode ? '#93c5fd' : '#60a5fa' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Fallback message for no contributions or errors */}
            {error && (
              <div className={`flex flex-col items-center justify-center p-8 text-center h-40 ${
                darkMode ? 'text-text-secondary' : 'text-gray-500'
              }`}>
                <svg className="w-12 h-12 mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v3a1 1 0 01-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <p className="text-lg font-medium">No contribution data available</p>
                <p className="text-sm mt-2 max-w-md">
                  This could be due to a new account, private contributions, or GitHub API limitations.
                  {retryCount >= 3 && " We've tried multiple times but couldn't retrieve the data."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Legend for contribution levels - only show in calendar view */}
      {viewMode === 'calendar' && (
        <div className={`px-6 py-4 flex justify-between items-center text-sm border-t ${
          darkMode ? 'border-border text-text-secondary' : 'border-gray-100 text-gray-500'
        }`}>
          <div>Less</div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((level) => (
              <div 
                key={level}
                className={`w-4 h-4 rounded transition-transform hover:scale-110 ${
                  level === 0 ? `${darkMode ? 'border border-border bg-surface/80' : 'border border-gray-200 bg-white'}` : ''
                }`} 
                style={{ 
                  backgroundColor: level === 0 ? '' : darkMode 
                    ? `rgba(96, 165, 250, ${level * 0.25})` 
                    : `rgba(59, 130, 246, ${level * 0.25})` 
                }}
              ></div>
            ))}
          </div>
          <div>More</div>
        </div>
      )}
      
      {/* Line chart explanation - only show in line chart view */}
      {viewMode === 'linechart' && (
        <div className={`px-6 py-4 text-sm border-t ${
          darkMode ? 'border-border text-text-secondary' : 'border-gray-100 text-gray-500'
        }`}>
          <div className="flex justify-between items-center">
            <div>Showing contribution frequency over the past year</div>
            <div className={`rounded-full px-2 py-1 text-xs ${darkMode ? 'bg-primary/10 text-primary-light' : 'bg-primary/10 text-primary'}`}>
              {totalContributions} total contributions
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionCalendar; 