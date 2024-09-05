import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  input, button {
    border: 1px solid ${({ theme }) => theme.secondary};
    border-radius: 4px;
  }

  button {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.secondary};
    }
  }
  
  input {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;
