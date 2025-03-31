import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MainContainer } from '../components/Layout';

// Styled Components
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Subtitle = styled.h3`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const Form = styled.form`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Input = styled.input`
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
`;

const Select = styled.select`
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
`;

const Button = styled.button`
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  border: 1px solid #ccc;
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid #ccc;
  text-align: left;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid #ccc;
`;

export default function BuyerPage() {
  const [buyers, setBuyers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [newBuyer, setNewBuyer] = useState({ name: '', budget: '' });
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [updateBuyer, setUpdateBuyer] = useState({ name: '', budget: '' });
  const [error, setError] = useState('');

  const loadBuyers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/buyers');
      setBuyers(res.data);
    } catch (error) {
      console.error('Error loading buyers:', error);
      setError('Error loading buyers.');
    }
  };

  const handleShowTable = () => {
    setShowTable(!showTable);
    if (!showTable) {
      loadBuyers();
    }
  };

  const handleNewChange = (e) => {
    setNewBuyer({ ...newBuyer, [e.target.name]: e.target.value });
  };

  const addBuyer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/buyers', {
        ...newBuyer,
        budget: Number(newBuyer.budget)
      });
      setNewBuyer({ name: '', budget: '' });
    } catch (error) {
      console.error('Error adding buyer:', error);
      setError('Error adding buyer.');
    }
  };

  const handleSelectBuyer = (e) => {
    const buyerId = e.target.value;
    const buyer = buyers.find(b => b._id === buyerId);
    setSelectedBuyer(buyer);
    if (buyer) {
      setUpdateBuyer({ name: buyer.name, budget: buyer.budget });
    } else {
      setUpdateBuyer({ name: '', budget: '' });
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateBuyer({ ...updateBuyer, [e.target.name]: e.target.value });
  };

  const updateSelectedBuyer = async (e) => {
    e.preventDefault();
    if (!selectedBuyer) return;
    try {
      await axios.put(`http://localhost:8080/api/buyers/${selectedBuyer._id}`, {
        ...updateBuyer,
        budget: Number(updateBuyer.budget)
      });
      setSelectedBuyer(null);
      setUpdateBuyer({ name: '', budget: '' });
      loadBuyers();
    } catch (error) {
      console.error('Error updating buyer:', error);
      setError('Error updating buyer.');
    }
  };

  const deleteSelectedBuyer = async () => {
    if (!selectedBuyer) return;
    try {
      await axios.delete(`http://localhost:8080/api/buyers/${selectedBuyer._id}`);
      setSelectedBuyer(null);
      setUpdateBuyer({ name: '', budget: '' });
      loadBuyers();
    } catch (error) {
      console.error('Error deleting buyer:', error);
      setError('Error deleting buyer.');
    }
  };

  return (
    <MainContainer>
      <Title>Buyer Management</Title>
      
      {/* Add New Buyer */}
      <Subtitle>Add New Buyer</Subtitle>
      <Form onSubmit={addBuyer}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={newBuyer.name}
          onChange={handleNewChange}
          required
        />
        <Input
          type="number"
          name="budget"
          placeholder="Budget"
          value={newBuyer.budget}
          onChange={handleNewChange}
          required
        />
        <Button type="submit">Add Buyer</Button>
      </Form>
      
      {/* Update/Delete Buyer */}
      <Subtitle>Update/Delete Buyer</Subtitle>
      <label>
        Select Buyer:&nbsp;
        <Select value={selectedBuyer ? selectedBuyer._id : ''} onChange={handleSelectBuyer}>
          <option value="">--Select Buyer--</option>
          {buyers.map(buyer => (
            <option key={buyer._id} value={buyer._id}>
              {buyer.name} (Budget: ${buyer.budget})
            </option>
          ))}
        </Select>
      </label>
      {selectedBuyer && (
        <div>
          <Form onSubmit={updateSelectedBuyer}>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={updateBuyer.name}
              onChange={handleUpdateChange}
              required
            />
            <Input
              type="number"
              name="budget"
              placeholder="Budget"
              value={updateBuyer.budget}
              onChange={handleUpdateChange}
              required
            />
            <Button type="submit">Update Buyer</Button>
          </Form>
          <Button onClick={deleteSelectedBuyer}>Delete Buyer</Button>
        </div>
      )}

      {/* Show Buyers Table */}
      <Button onClick={handleShowTable}>
        {showTable ? 'Hide Buyers Table' : 'Show Buyers Table'}
      </Button>
      {showTable && (
        <StyledTable>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Budget</Th>
            </tr>
          </thead>
          <tbody>
            {buyers.map(buyer => (
              <tr key={buyer._id}>
                <Td>{buyer._id}</Td>
                <Td>{buyer.name}</Td>
                <Td>{buyer.budget}</Td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </MainContainer>
  );
}
