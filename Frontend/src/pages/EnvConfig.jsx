import React, { useState } from "react";
import { axiosInstance } from "../api/auth";
import styled from "styled-components";

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  direction: ltr; /* Ensure left-to-right text direction */
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  text-align: center;
  color: ${(props) => (props.success ? "green" : "red")};
`;

function EnvConfig() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/update-config", {
        key,
        value,
      });

      if (response.status === 200) {
        setMessage("Configuration updated successfully!");
      } else {
        setMessage("Failed to update configuration.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while updating the configuration.");
    }
  };

  return (
    <Container>
      <Title>Update Configuration</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="key">Key:</Label>
          <Input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            dir="ltr" // Ensure left-to-right text direction
          />
        </div>
        <div>
          <Label htmlFor="value">Value:</Label>
          <Input
            type="text"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            dir="ltr" // Ensure left-to-right text direction
          />
        </div>
        <Button type="submit">Update Config</Button>
      </Form>
      {message && (
        <Message success={message.includes("successfully")}>{message}</Message>
      )}
    </Container>
  );
}

export default EnvConfig;
