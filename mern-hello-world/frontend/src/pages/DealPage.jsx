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

export default function DealPage() {
  const [deals, setDeals] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [cars, setCars] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [newDeal, setNewDeal] = useState({
    buyer_id: '',
    seller_id: '',
    car_id: '',
    deal_amt: ''
  });
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [updateDeal, setUpdateDeal] = useState({
    buyer_id: '',
    seller_id: '',
    car_id: '',
    deal_amt: ''
  });
  const [error, setError] = useState('');

  // Load data functions
  const loadDeals = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/deals');
      setDeals(res.data);
    } catch (err) {
      console.error('Error loading deals:', err);
    }
  };

  const loadBuyers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/buyers');
      setBuyers(res.data);
    } catch (err) {
      console.error('Error loading buyers:', err);
    }
  };

  const loadSellers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/sellers');
      setSellers(res.data);
    } catch (err) {
      console.error('Error loading sellers:', err);
    }
  };

  const loadCars = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/cars');
      setCars(res.data);
    } catch (err) {
      console.error('Error loading cars:', err);
    }
  };

  useEffect(() => {
    loadBuyers();
    loadSellers();
    loadCars();
  }, []);

  const handleShowTable = () => {
    setShowTable(!showTable);
    if (!showTable) loadDeals();
  };

  // Filter cars based on selected seller in new deal form
  const filteredCars = newDeal.seller_id
    ? cars.filter(
        (car) =>
          (car.curr_owner === newDeal.seller_id) ||
          (car.curr_owner && car.curr_owner._id === newDeal.seller_id)
      )
    : cars;

  // Get buyer's budget for validation
  const selectedBuyer = buyers.find(b => b._id === newDeal.buyer_id);
  const buyerBudget = selectedBuyer ? Number(selectedBuyer.budget) : Infinity;

  const handleNewChange = (e) => {
    if (e.target.name === 'deal_amt') {
      const value = Number(e.target.value);
      if (selectedBuyer && value > buyerBudget) {
        setError(`Deal amount cannot exceed buyer's budget of $${buyerBudget}`);
      } else {
        setError('');
      }
    }
    setNewDeal({ ...newDeal, [e.target.name]: e.target.value });
  };

  const addDeal = async (e) => {
    e.preventDefault();
    if (selectedBuyer && Number(newDeal.deal_amt) > buyerBudget) {
      setError(`Deal amount cannot exceed buyer's budget of $${buyerBudget}`);
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/deals', {
        ...newDeal,
        deal_amt: Number(newDeal.deal_amt)
      });
      setNewDeal({ buyer_id: '', seller_id: '', car_id: '', deal_amt: '' });
      setError('');
      if (showTable) loadDeals();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while adding the deal.');
      }
    }
  };

  const handleSelectDeal = (e) => {
    const dealId = e.target.value;
    const deal = deals.find(d => d._id === dealId);
    setSelectedDeal(deal);
    if (deal) {
      setUpdateDeal({
        buyer_id: deal.buyer_id._id || deal.buyer_id,
        seller_id: deal.seller_id._id || deal.seller_id,
        car_id: deal.car_id._id || deal.car_id,
        deal_amt: deal.deal_amt
      });
    } else {
      setUpdateDeal({ buyer_id: '', seller_id: '', car_id: '', deal_amt: '' });
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateDeal({ ...updateDeal, [e.target.name]: e.target.value });
  };

  const updateSelectedDeal = async (e) => {
    e.preventDefault();
    if (!selectedDeal) return;
    try {
      await axios.put(`http://localhost:8080/api/deals/${selectedDeal._id}`, {
        ...updateDeal,
        deal_amt: Number(updateDeal.deal_amt)
      });
      setSelectedDeal(null);
      setUpdateDeal({ buyer_id: '', seller_id: '', car_id: '', deal_amt: '' });
      loadDeals();
    } catch (err) {
      console.error('Error updating deal:', err);
      setError('Error updating deal.');
    }
  };

  const deleteSelectedDeal = async () => {
    if (!selectedDeal) return;
    try {
      await axios.delete(`http://localhost:8080/api/deals/${selectedDeal._id}`);
      setSelectedDeal(null);
      setUpdateDeal({ buyer_id: '', seller_id: '', car_id: '', deal_amt: '' });
      loadDeals();
    } catch (err) {
      console.error('Error deleting deal:', err);
      setError('Error deleting deal.');
    }
  };

  return (
    <Container>
      <Title>Deal Management</Title>
      <Button onClick={handleShowTable}>
        {showTable ? 'Hide Deals Table' : 'Show Deals Table'}
      </Button>
      {showTable && (
        <StyledTable>
          <thead>
            <tr>
              <Th>Deal ID</Th>
              <Th>Buyer</Th>
              <Th>Seller</Th>
              <Th>Car</Th>
              <Th>Deal Amount</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {deals.map(deal => (
              <tr key={deal._id}>
                <Td>{deal._id}</Td>
                <Td>{deal.buyer_id?.name || deal.buyer_id}</Td>
                <Td>{deal.seller_id?.name || deal.seller_id}</Td>
                <Td>{deal.car_id?.make ? `${deal.car_id.make} ${deal.car_id.model}` : deal.car_id}</Td>
                <Td>{deal.deal_amt}</Td>
                <Td>
                  <Button onClick={() => {
                    setSelectedDeal(deal);
                    setUpdateDeal({
                      buyer_id: deal.buyer_id._id || deal.buyer_id,
                      seller_id: deal.seller_id._id || deal.seller_id,
                      car_id: deal.car_id._id || deal.car_id,
                      deal_amt: deal.deal_amt
                    });
                  }}>Select</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}

      <Subtitle>Add New Deal</Subtitle>
      <Form onSubmit={addDeal}>
        <label>
          Buyer:&nbsp;
          <Select name="buyer_id" value={newDeal.buyer_id} onChange={handleNewChange} required>
            <option value="">--Select Buyer--</option>
            {buyers.map(buyer => (
              <option key={buyer._id} value={buyer._id}>
                {buyer.name} (Budget: ${buyer.budget})
              </option>
            ))}
          </Select>
        </label>
        <br />
        <label>
          Seller:&nbsp;
          <Select name="seller_id" value={newDeal.seller_id} onChange={handleNewChange} required>
            <option value="">--Select Seller--</option>
            {sellers.map(seller => (
              <option key={seller._id} value={seller._id}>
                {seller.name}
              </option>
            ))}
          </Select>
        </label>
        <br />
        <label>
          Car:&nbsp;
          <Select name="car_id" value={newDeal.car_id} onChange={handleNewChange} required>
            <option value="">--Select Car--</option>
            {filteredCars.map(car => (
              <option key={car._id} value={car._id}>
                {car.make} {car.model}
              </option>
            ))}
          </Select>
        </label>
        <br />
        <label>
          Deal Amount:&nbsp;
          <Input
            type="number"
            name="deal_amt"
            placeholder="Deal Amount"
            value={newDeal.deal_amt}
            onChange={handleNewChange}
            required
          />
        </label>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" disabled={!!error}>Add Deal</Button>
      </Form>

      <Subtitle>Update/Delete Deal</Subtitle>
      <label>
        Select Deal:&nbsp;
        <Select value={selectedDeal ? selectedDeal._id : ''} onChange={handleSelectDeal}>
          <option value="">--Select Deal--</option>
          {deals.map(deal => (
            <option key={deal._id} value={deal._id}>
              {deal._id} - {deal.buyer_id?.name || deal.buyer_id} - {deal.seller_id?.name || deal.seller_id}
            </option>
          ))}
        </Select>
      </label>
      {selectedDeal && (
        <div>
          <Form onSubmit={updateSelectedDeal}>
            <label>
              Buyer:&nbsp;
              <Select name="buyer_id" value={updateDeal.buyer_id} onChange={handleUpdateChange} required>
                <option value="">--Select Buyer--</option>
                {buyers.map(buyer => (
                  <option key={buyer._id} value={buyer._id}>
                    {buyer.name} (Budget: ${buyer.budget})
                  </option>
                ))}
              </Select>
            </label>
            <br />
            <label>
              Seller:&nbsp;
              <Select name="seller_id" value={updateDeal.seller_id} onChange={handleUpdateChange} required>
                <option value="">--Select Seller--</option>
                {sellers.map(seller => (
                  <option key={seller._id} value={seller._id}>
                    {seller.name}
                  </option>
                ))}
              </Select>
            </label>
            <br />
            <label>
              Car:&nbsp;
              <Select name="car_id" value={updateDeal.car_id} onChange={handleUpdateChange} required>
                <option value="">--Select Car--</option>
                {cars
                  .filter(car => (car.curr_owner === updateDeal.seller_id) || (car.curr_owner && car.curr_owner._id === updateDeal.seller_id))
                  .map(car => (
                    <option key={car._id} value={car._id}>
                      {car.make} {car.model}
                    </option>
                ))}
              </Select>
            </label>
            <br />
            <Input
              type="number"
              name="deal_amt"
              placeholder="Deal Amount"
              value={updateDeal.deal_amt}
              onChange={handleUpdateChange}
              required
            />
            <br />
            <Button type="submit">Update Deal</Button>
          </Form>
          <Button onClick={deleteSelectedDeal}>Delete Deal</Button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
}
