import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.9rem;
  
  &.edit {
    background: #ffc107;
    color: #000;
  }
  
  &.delete {
    background: #dc3545;
    color: white;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  border-radius: 5px;
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#f8f9fa'};
  }
`;

const Amount = styled.span`
  font-weight: 600;
  color: ${props => props.type === 'income' ? '#00C49F' : '#FF8042'};
`;

const TransactionList = ({ canEdit }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch transactions and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, categoriesRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/categories')
        ]);
        setTransactions(transactionsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || transaction.type === filterType;
      const matchesCategory = !filterCategory || transaction.category_id === parseInt(filterCategory);
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, filterType, filterCategory]);

  // Memoize paginated transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Handle delete transaction
  const handleDelete = useCallback(async (id) => {
    if (!canEdit) return;
    
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        setTransactions(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  }, [canEdit]);

  if (loading) {
    return <Container><div>Loading transactions...</div></Container>;
  }

  return (
    <Container>
      <Title>Transactions</Title>
      
      <Controls>
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
      </Controls>

      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Category</Th>
            <Th>Type</Th>
            <Th>Amount</Th>
            {canEdit && <Th>Actions</Th>}
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map(transaction => (
            <tr key={transaction.id}>
              <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
              <Td>{transaction.description}</Td>
              <Td>{transaction.category}</Td>
              <Td style={{ textTransform: 'capitalize' }}>{transaction.type}</Td>
                             <Td>
                 <Amount type={transaction.type}>
                   ${parseFloat(transaction.amount || 0).toFixed(2)}
                 </Amount>
               </Td>
              {canEdit && (
                <Td>
                  <Button className="edit" disabled={!canEdit}>
                    Edit
                  </Button>
                  <Button 
                    className="delete" 
                    onClick={() => handleDelete(transaction.id)}
                    disabled={!canEdit}
                  >
                    Delete
                  </Button>
                </Td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {filteredTransactions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No transactions found
        </div>
      )}

      {filteredTransactions.length > itemsPerPage && (
        <Pagination>
          {Array.from({ length: Math.ceil(filteredTransactions.length / itemsPerPage) }, (_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
        </Pagination>
      )}
    </Container>
  );
};

export default TransactionList; 