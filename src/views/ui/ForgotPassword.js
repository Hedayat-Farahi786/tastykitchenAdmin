import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://tastykitchen-backend.vercel.app/auth/forgot-password",
        { username: email.toLowerCase() }
      );
      setMessage(response.data);
      setError("");
    } catch (error) {
      setError(error.response.data.message);
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Card>
          <CardBody>
            {error && <Alert color="danger">{error}</Alert>}
            {message && <Alert color="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormGroup>
              <div className="mt-4">
                <Button type="submit" color="primary" className="w-full">
                  Send Reset Link
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
