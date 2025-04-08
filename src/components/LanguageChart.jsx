import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const LanguageChart = ({ languageStats, darkMode }) => {
  const [data, setData] = useState([]);
  const [totalBytes, setTotalBytes] = useState(0);

  useEffect(() => {
    if (languageStats && languageStats.bytesPerLanguage && languageStats.reposPerLanguage) {
      // Combine bytes and repo counts into a single data structure
      const combinedData = Object.entries(languageStats.bytesPerLanguage).map(([name, bytes]) => ({
        name,
        bytes,
        repoCount: languageStats.reposPerLanguage[name] || 0
      }));

      // Sort by bytes in descending order
      const sortedData = combinedData
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 10); // Limit to top 10 languages

      const total = sortedData.reduce((sum, item) => sum + item.bytes, 0);
      setTotalBytes(total);
      setData(sortedData);
    }
  }, [languageStats]);

  // Generate colors for bars
  const COLORS = [
    '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
    '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395'
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const language = payload[0].payload;
      const percentage = ((language.bytes / totalBytes) * 100).toFixed(1);
      
      return (
        <div className={`p-3 rounded-md shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <p className="font-bold">{language.name}</p>
          <p className="text-sm">{formatBytes(language.bytes)}</p>
          <p className="text-sm">Used in {language.repoCount} repositories</p>
          <p className="text-sm">{percentage}% of codebase</p>
        </div>
      );
    }
    return null;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-xl font-bold mb-4">Language Usage</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              stroke={darkMode ? '#CBD5E1' : '#64748B'}
              label={{ 
                value: 'Lines of Code (bytes)', 
                position: 'insideBottom', 
                offset: -15,
                fill: darkMode ? '#CBD5E1' : '#1E293B'
              }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              stroke={darkMode ? '#CBD5E1' : '#64748B'}
              tick={{ fill: darkMode ? '#CBD5E1' : '#1E293B' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bytes" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LanguageChart; 