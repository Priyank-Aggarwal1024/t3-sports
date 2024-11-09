import React, { useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiClock, FiUsers } from 'react-icons/fi';
import { useOrders } from '../contexts/OrdersContext';

const Analytics = () => {
  const { orders, loading, error } = useOrders();
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  // Utility function for Indian currency format
  const formatToIndianRupees = (number) => {
    const amount = Math.round(number) || 0;
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      style: 'decimal',
    }).format(amount);
  };

  // Calculate basic stats
  const calculateStats = () => {
    if (!orders.length)
      return {
        totalRevenue: 0,
        avgOrderValue: 0,
        totalOrders: 0,
        prepaidCount: 0,
        cashCount: 0,
        cancelledOrders: 0,
        successRate: 0,
      };

    const activeOrders = orders.filter((order) => order.status !== 'cancelled');
    const totalRevenue = activeOrders.reduce(
      (sum, order) => sum + (Number(order.order_amount) || 0),
      0
    );
    const prepaidCount = orders.filter((order) => order.payment_method === 'prepaid').length;
    const cashCount = orders.filter((order) => order.payment_method === 'cash').length;
    const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;

    return {
      totalRevenue,
      avgOrderValue: totalRevenue / activeOrders.length,
      totalOrders: orders.length,
      prepaidCount,
      cashCount,
      cancelledOrders,
      successRate: ((orders.length - cancelledOrders) / orders.length) * 100,
    };
  };

  // Calculate time-based metrics
  const calculateTimeBasedMetrics = () => {
    const today = new Date();
    const timeRangeMap = {
      week: 7,
      month: 30,
      year: 365,
    };

    const daysToInclude = timeRangeMap[timeRange];
    const startDate = new Date(today.setDate(today.getDate() - daysToInclude));

    const filteredOrders = orders.filter((order) => new Date(order.order_date) >= startDate);

    // Group orders by date
    const ordersByDate = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.order_date).toLocaleDateString();
      acc[date] = acc[date] || { count: 0, revenue: 0 };
      acc[date].count += 1;
      acc[date].revenue += Number(order.order_amount) || 0;
      return acc;
    }, {});

    return {
      labels: Object.keys(ordersByDate),
      orderCounts: Object.values(ordersByDate).map((day) => day.count),
      revenues: Object.values(ordersByDate).map((day) => day.revenue),
    };
  };

  // Calculate order time distribution
  const calculateHourlyDistribution = () => {
    const hourlyOrders = new Array(24).fill(0);

    orders.forEach((order) => {
      const hour = new Date(order.order_date).getHours();
      hourlyOrders[hour]++;
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      data: hourlyOrders,
    };
  };

  // New function to calculate state-wise distribution
  const calculateStateDistribution = () => {
    const stateData = orders.reduce((acc, order) => {
      const state = order.shipping_state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    // Sort states by order count
    const sortedStates = Object.entries(stateData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10 states

    return {
      labels: sortedStates.map(([state]) => state),
      data: sortedStates.map(([, count]) => count)
    };
  };

  const stats = calculateStats();
  const timeMetrics = calculateTimeBasedMetrics();
  const hourlyDist = calculateHourlyDistribution();
  const stateDist = calculateStateDistribution();

  // Chart configurations
  const revenueChartData = {
    labels: timeMetrics.labels,
    datasets: [
      {
        label: 'Daily Revenue',
        data: timeMetrics.revenues,
        borderColor: '#0395d0',
        backgroundColor: 'rgba(3, 149, 208, 0.2)',
        fill: true,
      },
    ],
  };

  const orderDistributionData = {
    labels: ['Prepaid', 'Cash', 'Cancelled'],
    datasets: [
      {
        data: [stats.prepaidCount, stats.cashCount, stats.cancelledOrders],
        backgroundColor: ['#0395d0', '#0C0C0C', '#DC2626'],
        hoverBackgroundColor: ['#db2777', '#C7C8CC', '#EF4444'],
      },
    ],
  };

  const hourlyDistributionData = {
    labels: hourlyDist.labels,
    datasets: [
      {
        label: 'Orders by Hour',
        data: hourlyDist.data,
        backgroundColor: '#0395d0',
        borderColor: '#0C0C0C',
        borderWidth: 1,
      },
    ],
  };

  const stateDistributionData = {
    labels: stateDist.labels,
    datasets: [{
      label: 'Orders by State',
      data: stateDist.data,
      backgroundColor: Array(10).fill('#0395d0'),
      borderColor: Array(10).fill('#0C0C0C'),
      borderWidth: 1
    }]
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-light min-h-screen">
      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="py-2 px-6 rounded-md text-xs hover:cursor-pointer bg-transparent border border-primary dark:text-primary hover:bg-primary hover:dark:text-white hover:text-white"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{formatToIndianRupees(stats.totalRevenue)}</h3>
            </div>
            <FiDollarSign className="text-primary text-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Average Order Value</p>
              <h3 className="text-2xl font-bold">₹{formatToIndianRupees(stats.avgOrderValue)}</h3>
            </div>
            <FiShoppingBag className="text-primary text-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Success Rate</p>
              <h3 className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</h3>
            </div>
            <FiTrendingUp className="text-primary text-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <FiUsers className="text-primary text-2xl" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4 h-96 w-full">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4 h-96 w-full">
          <h2 className="text-xl font-bold mb-4">Order Distribution</h2>
          <Doughnut
            data={orderDistributionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>

      <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4 h-96 w-full mb-6">
        <h2 className="text-xl font-bold mb-4">Hourly Order Distribution</h2>
        <Bar
          data={hourlyDistributionData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>

      <div className="bg-white dark:bg-darkPrimary dark:text-white text-black shadow-lg rounded-md p-4 h-96 w-full mb-6">
          <h2 className="text-xl font-bold mb-4">Top States by Orders</h2>
          <Bar data={stateDistributionData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }} />
        </div>
        </div>
    </div>
  );
};

export default Analytics;
