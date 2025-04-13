import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, 
  PointElement, ArcElement, Title, Tooltip, Legend
);



const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState({
    server1: { 
      info: 0, 
      error: 0, 
      warning: 0, 
      responseTime: [0], // Initialize with default value
      requestCount: 0 
    },
    server2: { 
      info: 0, 
      error: 0, 
      warning: 0, 
      responseTime: [0], // Initialize with default value
      requestCount: 0 
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testProgress, setTestProgress] = useState([]);

  const handleReturn = () => {
    navigate('/home');
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/logs');
      setLogs(res.data);
    } catch (error) {
      console.error('Error al obtener logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const performStressTest = async () => {
    console.log('Starting stress test...');
    setIsLoading(true);
    setTestProgress([]);
    const totalRequests = 20;
    let requestCounts = { server1: 0, server2: 0 };
    // Remove unused variables
    // let responseTimes = { server1: [], server2: [] };
    // let switchedToServer2 = false;
  
    try {
      for (let i = 1; i <= totalRequests; i++) {
        const timestamp = new Date().toLocaleTimeString();
        let startTime = Date.now();
        try {
          const response = await axios.get('/getInfo');
          const endTime = Date.now();
          const currentServer = response.config.baseURL.includes('server2') ? '2' : '1';
          const responseTime = endTime - startTime;
          
          requestCounts[`server${currentServer}`]++;
  
          setTestProgress(prev => [...prev, {
            timestamp,
            message: `Request ${i}/${totalRequests} - Server ${currentServer} - Status: ${response.status} - Response time: ${responseTime}ms`,
            type: 'success'
          }]);
  
          // Update logs
          setLogs(prev => ({
            ...prev,
            [`server${currentServer}`]: {
              ...prev[`server${currentServer}`],
              responseTime: [...(prev[`server${currentServer}`].responseTime || []), responseTime],
              info: (prev[`server${currentServer}`].info || 0) + 1
            }
          }));
        } catch (error) {
          console.error(`Error on request ${i}/${totalRequests}:`, error);
          const isRateLimit = error.response?.status === 429;
          const server = error.config?.baseURL?.includes('3001') ? '1' : '2';
          // Even failed requests count towards the total
          requestCounts[`server${server}`]++;
  
          const retryAfter = error.response?.headers?.['retry-after'] || 'N/A';
  
          let errorMessage = isRateLimit 
            ? `Rate limit exceeded on Server ${server} (Retry after: ${retryAfter}s) - Switching to Server 2`
            : error.message;
  
          setTestProgress(prev => [...prev, {
            timestamp,
            message: `Request ${i}/${totalRequests} - Server ${server} - Status: ${error.response?.status || 'Unknown'} - ${errorMessage}`,
            type: 'error'
          }]);
  
          if (isRateLimit) {
            console.log('Switching traffic to Server 2 due to rate limit on Server 1');
            setTestProgress(prev => [...prev, {
              timestamp,
              message: `Switching traffic to Server 2 due to rate limit on Server 1`,
              type: 'warning'
            }]);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Log Types Bar Chart
  const logTypesData = {
    labels: ['Info', 'Error'],
    datasets: [
      {
        label: 'Servidor 1 (Rate Limited)',
        data: [logs.server1.info || 0, logs.server1.error || 0],
        backgroundColor: '#FF4B4B',
        borderColor: '#CC3333',
        borderWidth: 2,
      },
      {
        label: 'Servidor 2',
        data: [logs.server2.info || 0, logs.server2.error || 0],
        backgroundColor: '#4B96FF',
        borderColor: '#3373CC',
        borderWidth: 2,
      },
    ],
  };

  // Response Time Line Chart
  const responseTimeData = {
    labels: Array.from({ length: Math.max(
      logs.server1.responseTime?.length || 0,
      logs.server2.responseTime?.length || 0
    ) }, (_, i) => `Request ${i + 1}`),
    datasets: [
      {
        label: 'Servidor 1 Response Time (ms)',
        data: logs.server1.responseTime || [],
        borderColor: '#FF4B4B',
        backgroundColor: 'rgba(255, 75, 75, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Servidor 2 Response Time (ms)',
        data: logs.server2.responseTime || [],
        borderColor: '#4B96FF',
        backgroundColor: 'rgba(75, 150, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          color: '#FFFFFF', 
          font: { size: 12 },
          padding: 10
        },
      },
      title: {
        display: true,
        color: '#FFFFFF',
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 15 },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#FFFFFF' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#FFFFFF' },
        beginAtZero: true,
        // Add min and max for better scale
        min: 0,
        max: Math.max(
          ...(logs.server1.responseTime || [0]),
          ...(logs.server2.responseTime || [0])
        ) + 100,
        // Format ticks to show ms
        callback: (value) => `${value}ms`
      },
    },
  };

  // Request Distribution Doughnut
  // Request Distribution Data
  const requestDistributionData = {
    labels: ['Servidor 1', 'Servidor 2'],
    datasets: [{
      data: [
        (logs.server1.info || 0) + (logs.server1.error || 0),
        (logs.server2.info || 0) + (logs.server2.error || 0)
      ],
      backgroundColor: ['#FF4B4B', '#4B96FF'],
      borderColor: ['#CC3333', '#3373CC'],
      borderWidth: 2,
    }],
  };

  return (
    <div className="logs-container spotify-theme">
      <h2>Logs Dashboard</h2>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Distribución de tipos de Logs</h3>
          <Bar data={logTypesData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Tiempos de respuesta</h3>
          <Line data={responseTimeData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Distribución de peticiones</h3>
          <Doughnut data={requestDistributionData} options={{
            ...chartOptions,
            cutout: '70%',
          }} />
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h4>Server 1 Con Rate Limit</h4>
          <div className="stat-item">
            <span>Info</span>
            <span className="stat-value">{logs.server1.info}</span>
          </div>          <div className="stat-item">
            <span>Error</span>
            <span className="stat-value">{logs.server1.error}</span>
          </div>
        </div>

        <div className="stat-card">
          <h4>Server 2 Sin Rate Limit</h4>
          <div className="stat-item">
            <span>Info</span>
            <span className="stat-value">{logs.server2.info}</span>
          </div>
          <div className="stat-item">
            <span>Error</span>
            <span className="stat-value">{logs.server2.error}</span>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleReturn}>Regresar</button>
        <button 
          onClick={performStressTest}
          className="stress-test-button"
          disabled={isLoading}
        >
          {isLoading ? 'Running Test...' : 'Run Stress Test'}
        </button>
      </div>

      {/* Add Progress Log Display */}
      {testProgress.length > 0 && (
        <div className="progress-log-container">
          <h3>Stress Test Progress</h3>
          <div className="progress-logs">
            {testProgress.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                <span className="timestamp">[{log.timestamp}]</span>
                <span className="message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;