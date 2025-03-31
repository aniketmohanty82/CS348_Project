import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

export default function SellerPage() {
  const [sellers, setSellers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', email: '', phone: '' });
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [updateSeller, setUpdateSeller] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  const loadSellers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/sellers');
      setSellers(res.data);
    } catch (err) {
      console.error('Error loading sellers:', err);
      setError('Error loading sellers.');
    }
  };

  const handleShowTable = () => {
    setShowTable(!showTable);
    if (!showTable) {
      loadSellers();
    }
  };

  const handleNewChange = (e) => {
    setNewSeller({ ...newSeller, [e.target.name]: e.target.value });
  };

  const addSeller = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/sellers', newSeller);
      setNewSeller({ name: '', email: '', phone: '' });
      setError('');
    } catch (err) {
      console.error('Error adding seller:', err);
      setError('Error adding seller.');
    }
  };

  const handleSelectSeller = (e) => {
    const sellerId = e.target.value;
    const seller = sellers.find(s => s._id === sellerId);
    setSelectedSeller(seller);
    if (seller) {
      setUpdateSeller({ name: seller.name, email: seller.email, phone: seller.phone });
    } else {
      setUpdateSeller({ name: '', email: '', phone: '' });
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateSeller({ ...updateSeller, [e.target.name]: e.target.value });
  };

  const updateSelectedSeller = async (e) => {
    e.preventDefault();
    if (!selectedSeller) return;
    try {
      await axios.put(`http://localhost:8080/api/sellers/${selectedSeller._id}`, updateSeller);
      setSelectedSeller(null);
      setUpdateSeller({ name: '', email: '', phone: '' });
      loadSellers();
      setError('');
    } catch (err) {
      console.error('Error updating seller:', err);
      setError('Error updating seller.');
    }
  };

  const deleteSelectedSeller = async () => {
    if (!selectedSeller) return;
    try {
      await axios.delete(`http://localhost:8080/api/sellers/${selectedSeller._id}`);
      setSelectedSeller(null);
      setUpdateSeller({ name: '', email: '', phone: '' });
      loadSellers();
      setError('');
    } catch (err) {
      console.error('Error deleting seller:', err);
      setError('Error deleting seller.');
    }
  };

  return (
    <Container>
      <Title>Seller Management</Title>
      
      {/* Add New Seller */}
      <Subtitle>Add New Seller</Subtitle>
      <Form onSubmit={addSeller}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={newSeller.name}
          onChange={handleNewChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={newSeller.email}
          onChange={handleNewChange}
          required
        />
        <Input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newSeller.phone}
          onChange={handleNewChange}
          required
        />
        <Button type="submit">Add Seller</Button>
      </Form>
      
      {/* Update/Delete Seller */}
      <Subtitle>Update/Delete Seller</Subtitle>
      <label>
        Select Seller:&nbsp;
        <Select value={selectedSeller ? selectedSeller._id : ''} onChange={handleSelectSeller}>
          <option value="">--Select Seller--</option>
          {sellers.map(seller => (
            <option key={seller._id} value={seller._id}>
              {seller.name}
            </option>
          ))}
        </Select>
      </label>
      {selectedSeller && (
        <div>
          <Form onSubmit={updateSelectedSeller}>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={updateSeller.name}
              onChange={handleUpdateChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={updateSeller.email}
              onChange={handleUpdateChange}
              required
            />
            <Input
              type="text"
              name="phone"
              placeholder="Phone"
              value={updateSeller.phone}
              onChange={handleUpdateChange}
              required
            />
            <Button type="submit">Update Seller</Button>
          </Form>
          <Button onClick={deleteSelectedSeller}>Delete Seller</Button>
        </div>
      )}

      <Button onClick={handleShowTable}>
        {showTable ? 'Hide Sellers Table' : 'Show Sellers Table'}
      </Button>
      {showTable && (
        <StyledTable>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
            </tr>
          </thead>
          <tbody>
            {sellers.map(seller => (
              <tr key={seller._id}>
                <Td>{seller._id}</Td>
                <Td>{seller.name}</Td>
                <Td>{seller.email}</Td>
                <Td>{seller.phone}</Td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
}
