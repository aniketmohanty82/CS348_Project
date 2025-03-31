// src/components/Layout.jsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const MainContainer = styled.div`
  max-width: 900px;        /* or whatever width you prefer */
  margin: 0 auto;          /* centers the container horizontally */
  padding: ${({ theme }) => theme.spacing(2)};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const NavLink = styled(Link)`
  color: white;
  margin-right: ${({ theme }) => theme.spacing(2)};
  text-decoration: none;
  font-weight: bold;
`;

export default function Layout({ children }) {
  return (
    <>
      <Header>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/buyers">Buyers</NavLink>
        <NavLink to="/sellers">Sellers</NavLink>
        <NavLink to="/cars">Cars</NavLink>
        <NavLink to="/deals">Deals</NavLink>
        <NavLink to="/report">Report</NavLink>
      </Header>
      <Container>{children}</Container>
    </>
  );
}
