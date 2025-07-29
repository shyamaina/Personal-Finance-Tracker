import React, { Suspense, lazy, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

// Lazy load components for better performance
const TransactionList = lazy(() => import('./TransactionList'));
const Analytics = lazy(() => import('./Analytics'));
const AddTransaction = lazy(() => import('./AddTransaction'));

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #666;
  font-weight: 500;
`;

const UserRole = styled.span`
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #c0392b;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Memoize user role for conditional rendering
  const userRole = useMemo(() => user?.role || 'user', [user?.role]);
  
  // Check if user can perform CRUD operations
  const canEdit = useMemo(() => ['admin', 'user'].includes(userRole), [userRole]);

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Personal Finance Tracker</Title>
        <UserInfo>
          <UserName>Welcome, {user?.name}</UserName>
          <UserRole>{userRole}</UserRole>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <Suspense fallback={<LoadingSpinner>Loading Analytics...</LoadingSpinner>}>
          <Analytics />
        </Suspense>

        {canEdit && (
          <Suspense fallback={<LoadingSpinner>Loading Transaction Form...</LoadingSpinner>}>
            <AddTransaction />
          </Suspense>
        )}

        <Suspense fallback={<LoadingSpinner>Loading Transactions...</LoadingSpinner>}>
          <TransactionList canEdit={canEdit} />
        </Suspense>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 