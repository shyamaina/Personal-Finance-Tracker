import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';

const AnalyticsContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const YearSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartContainer = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  height: 400px;
`;

const ChartTitle = styled.h3`
  text-align: center;
  color: #555;
  margin-bottom: 1rem;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Analytics = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [overview, setOverview] = useState({ income: 0, expense: 0, net: 0 });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [incomeVsExpense, setIncomeVsExpense] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize expensive calculations
  const totalExpense = useMemo(() => 
    categoryBreakdown.reduce((sum, item) => sum + item.total, 0), 
    [categoryBreakdown]
  );

  const categoryData = useMemo(() => 
    categoryBreakdown.map((item, index) => ({
      name: item.category,
      value: parseFloat(item.total || 0),
      color: COLORS[index % COLORS.length]
    })), 
    [categoryBreakdown]
  );

  const monthlyData = useMemo(() => 
    incomeVsExpense.map(item => ({
      month: new Date(2024, item.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      income: parseFloat(item.income || 0),
      expense: parseFloat(item.expense || 0)
    })), 
    [incomeVsExpense]
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [overviewRes, categoryRes, trendRes] = await Promise.all([
          axios.get(`/api/analytics/overview?year=${year}`),
          axios.get(`/api/analytics/category-breakdown?year=${year}`),
          axios.get(`/api/analytics/income-vs-expense?year=${year}`)
        ]);

        setOverview(overviewRes.data);
        setCategoryBreakdown(categoryRes.data);
        setIncomeVsExpense(trendRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [year]);

  if (loading) {
    return (
      <AnalyticsContainer>
        <Title>Financial Analytics</Title>
        <div>Loading analytics...</div>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <Title>Financial Analytics</Title>
      
      <YearSelector value={year} onChange={(e) => setYear(Number(e.target.value))}>
        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </YearSelector>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Overview for {year}</h3>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#00C49F', fontWeight: 'bold' }}>
              ${overview.income.toFixed(2)}
            </div>
            <div style={{ color: '#666' }}>Total Income</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#FF8042', fontWeight: 'bold' }}>
              ${overview.expense.toFixed(2)}
            </div>
            <div style={{ color: '#666' }}>Total Expenses</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: overview.net >= 0 ? '#00C49F' : '#e74c3c', fontWeight: 'bold' }}>
              ${overview.net.toFixed(2)}
            </div>
            <div style={{ color: '#666' }}>Net</div>
          </div>
        </div>
      </div>

      <ChartsGrid>
        {/* Pie Chart - Category Distribution */}
        <ChartContainer>
          <ChartTitle>Expense by Category</ChartTitle>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Line Chart - Monthly Trends */}
        <ChartContainer>
          <ChartTitle>Monthly Income vs Expenses</ChartTitle>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Bar Chart - Income vs Expenses */}
        <ChartContainer>
          <ChartTitle>Income vs Expenses Comparison</ChartTitle>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#00C49F" />
              <Bar dataKey="expense" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartsGrid>
    </AnalyticsContainer>
  );
};

export default Analytics; 