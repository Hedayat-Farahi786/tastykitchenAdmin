import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import logo from "../../assets/images/logos/logo.png";
import {
  Card,
  CardBody,
  CardTitle,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { authState, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/starter");
    }
  }, [authState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        "https://tastykitchen-backend.vercel.app/auth/login",
        { username: email.toLowerCase(), password }
      );
      login(response.data.token);
      setSuccessMessage("Login successful!");
      navigate("/starter");
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto w-64" src={logo} alt="Your Company" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Card>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-5">
            Sign in to your account
          </h2>
          <CardBody>
            <p></p>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            {successMessage && <Alert color="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </FormGroup>
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-4">
                <Button type="submit" color="primary" className="w-full">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p> */}
      </div>
    </div>
  );
}
