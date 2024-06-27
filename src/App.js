import React, { useState } from 'react';
import './App.css';
import Chart from './components/Chart';
import TimeframeSelector from './components/TimeframeSelector';
import chartData from './data/chartData.json';

const App = () => {
  const [data, setData] = useState(chartData);

  const handleTimeframeSelect = (timeframe) => {
    let newData = [];

    switch (timeframe) {
      case 'daily':
        // Example: Show data points grouped by day
        newData = aggregateData('day');
        break;
      case 'weekly':
        // Example: Show data points grouped by week
        newData = aggregateData('week');
        break;
      case 'monthly':
        // Example: Show data points grouped by month
        newData = aggregateData('month');
        break;
      default:
        newData = chartData; // Default to show all data
        break;
    }

    setData(newData);
  };

  const aggregateData = (interval) => {
    const groupedData = [];
    const timestampMap = {};

    // Group data by specified interval (day, week, month)
    chartData.forEach((item) => {
      let timestampKey = '';

      switch (interval) {
        case 'day':
          timestampKey = item.timestamp.split('T')[0]; // Group by date
          break;
        case 'week':
          const date = new Date(item.timestamp);
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() - date.getDay()); // Get start of week
          timestampKey = date.toISOString().split('T')[0]; // Group by week
          break;
        case 'month':
          timestampKey = item.timestamp.split('-').slice(0, 2).join('-'); // Group by year-month
          break;
        default:
          break;
      }

      if (!timestampMap[timestampKey]) {
        timestampMap[timestampKey] = {
          timestamp: timestampKey,
          value: 0,
          count: 0,
        };
        groupedData.push(timestampMap[timestampKey]);
      }

      timestampMap[timestampKey].value += item.value;
      timestampMap[timestampKey].count += 1;
    });

    // Calculate average value for the interval
    groupedData.forEach((item) => {
      item.value /= item.count; // Calculate average value
    });

    return groupedData;
  };

  return (
    <div className="App">
      <h1>Interactive Chart with Recharts</h1>
      <TimeframeSelector onSelect={handleTimeframeSelect} />
      <Chart data={data} />
    </div>
  );
};

export default App;
