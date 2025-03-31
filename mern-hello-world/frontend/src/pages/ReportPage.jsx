import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components (you can customize these as needed)
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
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

export default function ReportPage() {
  const [reportType, setReportType] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [reportResult, setReportResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let payload = { reportType };

    if (reportType === 'sellerCars') {
      if (!sellerName) {
        setError('Seller Name is required');
        return;
      }
      payload.sellerName = sellerName;
    } else if (reportType === 'buyerBudgetCars') {
      if (!buyerName) {
        setError('Buyer Name is required');
        return;
      }
      payload.buyerName = buyerName;
    } else if (reportType === 'mileageBudgetCars') {
      if (!buyerName || !maxMileage) {
        setError('Buyer Name and Max Mileage are required');
        return;
      }
      payload.buyerName = buyerName;
      payload.maxMileage = maxMileage;
    } else if (reportType === 'dealsUnderAmount') {
      if (!maxAmount) {
        setError('Max Deal Amount is required');
        return;
      }
      payload.maxAmount = maxAmount;
    } else if (reportType === 'carByModelMake') {
      if (!carMake || !carModel) {
        setError('Car Make and Model are required');
        return;
      }
      payload.carMake = carMake;
      payload.carModel = carModel;
    } else {
      setError('Please select a valid report type');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/report', payload);
      setReportResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Render a table for a list of cars
  const renderCarsTable = (cars) => (
    <StyledTable>
      <thead>
        <tr>
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
            <Td>{car.make}</Td>
            <Td>{car.model}</Td>
            <Td>{car.price}</Td>
            <Td>{car.miles}</Td>
            <Td>{car.curr_owner}</Td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );

  // Render a table for a list of deals
  const renderDealsTable = (deals) => (
    <StyledTable>
      <thead>
        <tr>
          <Th>Buyer</Th>
          <Th>Seller</Th>
          <Th>Car</Th>
          <Th>Deal Amount</Th>
        </tr>
      </thead>
      <tbody>
        {deals.map(deal => (
          <tr key={deal._id}>
            <Td>{deal.buyer}</Td>
            <Td>{deal.seller}</Td>
            <Td>{deal.car.make} {deal.car.model}</Td>
            <Td>{deal.deal_amt}</Td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );

  return (
    <Container>
      <Title>Report Page</Title>
      <Form onSubmit={handleSubmit}>
        <label>
          Report Type:&nbsp;
          <Select value={reportType} onChange={(e) => setReportType(e.target.value)} required>
            <option value="">--Select Report Type--</option>
            <option value="sellerCars">Cars owned by a Seller</option>
            <option value="buyerBudgetCars">Cars in Buyer's Budget</option>
            <option value="mileageBudgetCars">Cars under certain Mileage & Buyer's Budget</option>
            <option value="dealsUnderAmount">Deals under a Certain Amount</option>
            <option value="carByModelMake">Find Car by Make & Model</option>
          </Select>
        </label>
        <br /><br />
        {reportType === 'sellerCars' && (
          <label>
            Seller Name:&nbsp;
            <Input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              required
            />
          </label>
        )}
        {reportType === 'buyerBudgetCars' && (
          <label>
            Buyer Name:&nbsp;
            <Input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </label>
        )}
        {reportType === 'mileageBudgetCars' && (
          <>
            <label>
              Buyer Name:&nbsp;
              <Input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Max Mileage:&nbsp;
              <Input
                type="number"
                value={maxMileage}
                onChange={(e) => setMaxMileage(e.target.value)}
                required
              />
            </label>
          </>
        )}
        {reportType === 'dealsUnderAmount' && (
          <label>
            Max Deal Amount:&nbsp;
            <Input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              required
            />
          </label>
        )}
        {reportType === 'carByModelMake' && (
          <>
            <label>
              Car Make:&nbsp;
              <Input
                type="text"
                value={carMake}
                onChange={(e) => setCarMake(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Car Model:&nbsp;
              <Input
                type="text"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                required
              />
            </label>
          </>
        )}
        <br /><br />
        <Button type="submit">Generate Report</Button>
      </Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reportResult && (
        <div style={{ marginTop: '2rem' }}>
          <Title>Report Result</Title>
          {reportResult.cars && renderCarsTable(reportResult.cars)}
          {reportResult.deals && renderDealsTable(reportResult.deals)}
          {reportType === 'carByModelMake' && reportResult.car && renderCarsTable([reportResult.car])}
        </div>
      )}
    </Container>
  );
}
