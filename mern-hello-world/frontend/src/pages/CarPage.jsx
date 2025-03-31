import { useState, useEffect } from 'react';
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

export default function CarPage() {
  const [cars, setCars] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    customMake: '',
    model: '',
    price: '',
    miles: '',
    curr_owner: ''
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [updateCar, setUpdateCar] = useState({
    make: '',
    model: '',
    price: '',
    miles: '',
    curr_owner: ''
  });
  const [existingMakes, setExistingMakes] = useState([]);
  const [error, setError] = useState('');

  const loadCars = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/cars');
      setCars(res.data);
      const makes = [...new Set(res.data.map(car => car.make))];
      setExistingMakes(makes);
    } catch (error) {
      console.error('Error loading cars:', error);
      setError('Error loading cars.');
    }
  };

  const loadSellers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/sellers');
      setSellers(res.data);
    } catch (error) {
      console.error('Error loading sellers:', error);
      setError('Error loading sellers.');
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleShowTable = () => {
    setShowTable(!showTable);
    if (!showTable) {
      loadCars();
    }
  };

  const handleNewChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const addCar = async (e) => {
    e.preventDefault();
    // If newCar.make is "__NEW__", use customMake
    const finalMake = newCar.make === '__NEW__' ? newCar.customMake : newCar.make;
    try {
      await axios.post('http://localhost:8080/api/cars', {
        ...newCar,
        make: finalMake,
        price: Number(newCar.price),
        miles: Number(newCar.miles)
      });
      setNewCar({
        make: '',
        customMake: '',
        model: '',
        price: '',
        miles: '',
        curr_owner: ''
      });
      if (showTable) loadCars();
    } catch (error) {
      console.error('Error adding car:', error);
      setError('Error adding car.');
    }
  };

  const handleSelectCar = (e) => {
    const carId = e.target.value;
    const car = cars.find(c => c._id === carId);
    setSelectedCar(car);
    if (car) {
      setUpdateCar({
        make: car.make,
        model: car.model,
        price: car.price,
        miles: car.miles,
        curr_owner: car.curr_owner?._id || car.curr_owner
      });
    } else {
      setUpdateCar({ make: '', model: '', price: '', miles: '', curr_owner: '' });
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateCar({ ...updateCar, [e.target.name]: e.target.value });
  };

  const updateSelectedCar = async (e) => {
    e.preventDefault();
    if (!selectedCar) return;
    try {
      await axios.put(`http://localhost:8080/api/cars/${selectedCar._id}`, {
        ...updateCar,
        price: Number(updateCar.price),
        miles: Number(updateCar.miles)
      });
      setSelectedCar(null);
      setUpdateCar({ make: '', model: '', price: '', miles: '', curr_owner: '' });
      loadCars();
    } catch (error) {
      console.error('Error updating car:', error);
      setError('Error updating car.');
    }
  };

  const deleteSelectedCar = async () => {
    if (!selectedCar) return;
    try {
      await axios.delete(`http://localhost:8080/api/cars/${selectedCar._id}`);
      setSelectedCar(null);
      setUpdateCar({ make: '', model: '', price: '', miles: '', curr_owner: '' });
      loadCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      setError('Error deleting car.');
    }
  };

  return (
    <Container>
      <Title>Car Management</Title>
      
      {/* Add New Car */}
      <Subtitle>Add New Car</Subtitle>
      <Form onSubmit={addCar}>
        <label>
          Make:&nbsp;
          <Select name="make" value={newCar.make} onChange={handleNewChange} required>
            <option value="">--Select Make--</option>
            {existingMakes.map((make, index) => (
              <option key={index} value={make}>{make}</option>
            ))}
            <option value="__NEW__">--New Make--</option>
          </Select>
        </label>
        {newCar.make === '__NEW__' && (
          <Input
            type="text"
            name="customMake"
            placeholder="Enter new make"
            value={newCar.customMake}
            onChange={handleNewChange}
            required
          />
        )}
        <br />
        <Input
          type="text"
          name="model"
          placeholder="Model"
          value={newCar.model}
          onChange={handleNewChange}
          required
        />
        <br />
        <Input
          type="number"
          name="price"
          placeholder="Price"
          value={newCar.price}
          onChange={handleNewChange}
          required
        />
        <br />
        <Input
          type="number"
          name="miles"
          placeholder="Miles"
          value={newCar.miles}
          onChange={handleNewChange}
          required
        />
        <br />
        <label>
          Current Owner:&nbsp;
          <Select name="curr_owner" value={newCar.curr_owner} onChange={handleNewChange} required>
            <option value="">--Select Seller--</option>
            {sellers.map(seller => (
              <option key={seller._id} value={seller._id}>{seller.name}</option>
            ))}
          </Select>
        </label>
        <br />
        <Button type="submit">Add Car</Button>
      </Form>
      
      {/* Update/Delete Car */}
      <Subtitle>Update/Delete Car</Subtitle>
      <label>
        Select Car:&nbsp;
        <Select value={selectedCar ? selectedCar._id : ''} onChange={handleSelectCar}>
          <option value="">--Select Car--</option>
          {cars.map(car => (
            <option key={car._id} value={car._id}>
              {car.make} {car.model}
            </option>
          ))}
        </Select>
      </label>
      {selectedCar && (
        <div>
          <Form onSubmit={updateSelectedCar}>
            <Input
              type="text"
              name="make"
              placeholder="Make"
              value={updateCar.make}
              onChange={handleUpdateChange}
              required
            />
            <Input
              type="text"
              name="model"
              placeholder="Model"
              value={updateCar.model}
              onChange={handleUpdateChange}
              required
            />
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={updateCar.price}
              onChange={handleUpdateChange}
              required
            />
            <Input
              type="number"
              name="miles"
              placeholder="Miles"
              value={updateCar.miles}
              onChange={handleUpdateChange}
              required
            />
            <label>
              Current Owner:&nbsp;
              <Select name="curr_owner" value={updateCar.curr_owner} onChange={handleUpdateChange} required>
                <option value="">--Select Seller--</option>
                {sellers.map(seller => (
                  <option key={seller._id} value={seller._id}>{seller.name}</option>
                ))}
              </Select>
            </label>
            <br />
            <Button type="submit">Update Car</Button>
          </Form>
          <Button onClick={deleteSelectedCar}>Delete Car</Button>
        </div>
      )}
      
      {/* Show Cars Table */}
      <Button onClick={handleShowTable}>
        {showTable ? 'Hide Cars Table' : 'Show Cars Table'}
      </Button>
      {showTable && (
        <StyledTable>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Make</Th>
              <Th>Model</Th>
              <Th>Price</Th>
              <Th>Miles</Th>
              <Th>Current Owner</Th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car._id}>
                <Td>{car._id}</Td>
                <Td>{car.make}</Td>
                <Td>{car.model}</Td>
                <Td>{car.price}</Td>
                <Td>{car.miles}</Td>
                <Td>{car.curr_owner?.name || car.curr_owner}</Td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
}
