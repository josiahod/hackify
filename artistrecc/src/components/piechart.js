import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GenrePieChart = ({ genres }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const genreCounts = {};
    console.log(genres);
    genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(genreCounts),
        datasets: [{
          label: 'Genre Distribution',
          data: Object.values(genreCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
            // Add more colors as needed
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    return () => {
      chart.destroy(); // Cleanup on component unmount
    };
  }, [genres]);

  return <canvas ref={chartRef} />;
};

export default GenrePieChart;
