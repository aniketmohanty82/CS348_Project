import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  text-align: center;
`;

const Heading = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.primary};
`;

const SubHeading = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

export default function Home() {
  return (
    <Container>
      <Heading>Welcome to the Car Deals Manager</Heading>
      <SubHeading>Select an option from the navigation menu.</SubHeading>
    </Container>
  );
}
