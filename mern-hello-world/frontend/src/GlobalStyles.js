import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
  }
  button, input, select {
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing(1)};
    border: 1px solid #ccc;
    font-size: 1rem;
  }
  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing(2)};
  }
  table, th, td {
    border: 1px solid #ccc;
  }
  th, td {
    padding: ${({ theme }) => theme.spacing(1)};
    text-align: left;
  }
  nav {
    background-color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing(2)};
    color: white;
  }
  nav a {
    color: white;
    margin-right: ${({ theme }) => theme.spacing(2)};
    text-decoration: none;
    font-weight: bold;
  }
`;

export default GlobalStyles;