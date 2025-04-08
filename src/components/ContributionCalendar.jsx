import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const ContributionCalendar = ({ username, darkMode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState('heatmap');
  const [contributions, setContributions] = useState([]);
  const maxRetries = 3;
  const imgRef = useRef(null);
  const chartUrlRef = useRef('');
  
  // Update the chart URL only when username changes
  useEffect(() => {
    if (!username) return;
    
    // Reset states when username changes
    setLoading(true);
    setError(null);
    setRetryCount(0);
    
    // Use more distinct colors for dark/light mode that match our design
    const themeColor = darkMode ? '60a5fa' : '3b82f6';
    chartUrlRef.current = `https://ghchart.rshah.org/${themeColor}/${username}`;
    
    // If we already have an image element, update its src
    if (imgRef.current) {
      imgRef.current.src = chartUrlRef.current;
    }
  }, [username, darkMode]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!response.ok) throw new Error('Failed to fetch contribution data');
        const data = await response.json();
        
        // Transform data for both views
        const transformedData = data.contributions.map(day => ({
          date: new Date(day.date),
          count: day.count
        }));
        setContributions(transformedData);
      } catch (err) {
        setError(err.message);
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
  };

  const maxContributions = Math.max(...contributions.map(d => d.count));
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 1);

  const renderHeatmap = () => (
    <div className="w-full overflow-x-auto">
      <img
        ref={imgRef}
        src={chartUrlRef.current}
        alt={`${username}'s GitHub contribution chart`}
        className="w-full h-auto"
        onError={() => setError('Failed to load contribution chart')}
      />
    </div>
  );

  const renderLineChart = () => {
    const width = 800;
    const height = 300;
    const padding = 40;
    const xScale = width / contributions.length;
    const yScale = height / (maxContributions || 1);

    return (
      <div className="w-full overflow-x-auto">
        <svg width={width + padding * 2} height={height + padding * 2} className="mx-auto">
          {/* X-axis */}
          <line
            x1={padding}
            y1={height + padding}
            x2={width + padding}
            y2={height + padding}
            stroke={darkMode ? '#4B5563' : '#D1D5DB'}
            strokeWidth="1"
          />
          
          {/* Y-axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height + padding}
            stroke={darkMode ? '#4B5563' : '#D1D5DB'}
            strokeWidth="1"
          />

          {/* X-axis labels (months) */}
          {Array.from({ length: 12 }, (_, i) => {
            const date = new Date(minDate);
            date.setMonth(date.getMonth() + i);
            const x = padding + (i * width / 12);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={height + padding}
                  x2={x}
                  y2={height + padding + 5}
                  stroke={darkMode ? '#4B5563' : '#D1D5DB'}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height + padding + 20}
                  textAnchor="middle"
                  fill={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize="12"
                >
                  {date.toLocaleString('default', { month: 'short' })}
                </text>
              </g>
            );
          })}

          {/* Y-axis labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const value = Math.round((maxContributions * i) / 4);
            const y = height + padding - (value * yScale);
            return (
              <g key={i}>
                <line
                  x1={padding - 5}
                  y1={y}
                  x2={padding}
                  y2={y}
                  stroke={darkMode ? '#4B5563' : '#D1D5DB'}
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize="12"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Line */}
          <path
            d={contributions.map((d, i) => {
              const x = padding + (i * xScale);
              const y = height + padding - (d.count * yScale);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke={darkMode ? '#60A5FA' : '#3B82F6'}
            strokeWidth="2"
            fill="none"
          />

          {/* Points */}
          {contributions.map((d, i) => {
            const x = padding + (i * xScale);
            const y = height + padding - (d.count * yScale);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                fill={darkMode ? '#60A5FA' : '#3B82F6'}
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  if (!username) {
    return null;
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${
      darkMode ? 'bg-surface' : 'bg-white'
    } border ${darkMode ? 'border-border' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-text">Contribution Activity</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'heatmap'
                  ? darkMode
                    ? 'bg-primary-dark text-white'
                    : 'bg-primary text-white'
                  : darkMode
                    ? 'hover:bg-surface/50 text-text-secondary'
                    : 'hover:bg-gray-50 text-gray-600'
              }`}
              title="Calendar View"
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('line')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'line'
                  ? darkMode
                    ? 'bg-primary-dark text-white'
                    : 'bg-primary text-white'
                  : darkMode
                    ? 'hover:bg-surface/50 text-text-secondary'
                    : 'hover:bg-gray-50 text-gray-600'
              }`}
              title="Line Chart View"
            >
              <ChartBarIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className={`mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
            {retryCount < maxRetries && (
              <button
                onClick={handleRetry}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-surface/50 hover:bg-surface text-primary-light'
                    : 'bg-gray-50 hover:bg-gray-100 text-primary'
                }`}
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Retry
              </button>
            )}
          </div>
        ) : contributions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className={`text-center ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              No contribution data available
            </p>
          </div>
        ) : (
          <div className="relative">
            {viewMode === 'heatmap' ? renderHeatmap() : renderLineChart()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionCalendar; 