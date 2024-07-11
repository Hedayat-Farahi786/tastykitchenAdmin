import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Card,
} from "reactstrap";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ color: "", message: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://tastykitchen-backend.vercel.app/auth/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `https://tastykitchen-backend.vercel.app/auth/delete/${deleteUserId}`
      );
      setAlert({ color: "success", message: "User deleted successfully" });
      setTimeout(() => {
        setAlert({ color: "", message: "" });
      }, 3000);
      fetchUsers();
    } catch (error) {
      setAlert({ color: "danger", message: "Error deleting user" });
      setTimeout(() => {
        setAlert({ color: "", message: "" });
      }, 3000);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://tastykitchen-backend.vercel.app/auth/register",
        newUser
      );
      setAlert({ color: "success", message: "User registered successfully" });
      setTimeout(() => {
        setAlert({ color: "", message: "" });
      }, 3000);
      fetchUsers();
      setIsRegisterModalOpen(false);
      setNewUser({ username: "", password: "" });
    } catch (error) {
      setAlert({ color: "danger", message: "Error registering user" });
      setTimeout(() => {
        setAlert({ color: "", message: "" });
      }, 3000);
    }
  };

  return (
    <Card className="container mt-5 px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="font-bold text-2xl">User Management</p>
        <Button color="primary" onClick={() => setIsRegisterModalOpen(true)}>
          Register New User
        </Button>
      </div>
      <div className="w-full bg-gray-300 h-[1px] mb-4"></div>

      {alert.message && <Alert color={alert.color}>{alert.message}</Alert>}
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <th scope="row">{index + 1}</th>
              <td>{user.username}</td>
              <td>
                <Button
                  color="danger"
                  onClick={() => {
                    setDeleteUserId(user._id);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
      >
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this user?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteUser}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Register New User Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        toggle={() => setIsRegisterModalOpen(false)}
      >
        <ModalHeader toggle={() => setIsRegisterModalOpen(false)}>
          Register New User
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleRegisterUser}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </FormGroup>
            <Button type="submit" color="primary" className="w-100">
              Register
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Card>
  );
};

export default Users;
