import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentCategory, setCurrentCategory] = useState({
    _id: "",
    name: "",
    description: "",
    extras: [],
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    extras: [],
  });
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch("http://localhost:4000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const toggleModal = () => setModal(!modal);
  const toggleEditModal = () => setEditModal(!editModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtraChange = (e, index, isEditing = false) => {
    const { name, value } = e.target;
    const updatedExtras = isEditing
      ? [...currentCategory.extras]
      : [...newCategory.extras];

    updatedExtras[index] = { ...updatedExtras[index], [name]: value };

    if (isEditing) {
      setCurrentCategory((prev) => ({
        ...prev,
        extras: updatedExtras,
      }));
    } else {
      setNewCategory((prev) => ({
        ...prev,
        extras: updatedExtras,
      }));
    }
  };

  const addExtraField = (isEditing = false) => {
    const newExtra = { name: "", price: "" };
    if (isEditing) {
      setCurrentCategory((prev) => ({
        ...prev,
        extras: [...prev.extras, newExtra],
      }));
    } else {
      setNewCategory((prev) => ({
        ...prev,
        extras: [...prev.extras, newExtra],
      }));
    }
  };

  const removeExtraField = (index, isEditing = false) => {
    const updatedExtras = isEditing
      ? [...currentCategory.extras]
      : [...newCategory.extras];

    updatedExtras.splice(index, 1);

    if (isEditing) {
      setCurrentCategory((prev) => ({
        ...prev,
        extras: updatedExtras,
      }));
    } else {
      setNewCategory((prev) => ({
        ...prev,
        extras: updatedExtras,
      }));
    }
  };

  const handleAddCategory = () => {
    fetch("http://localhost:4000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories();
        toggleModal();
        setNewCategory({ name: "", description: "", extras: [] });
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  const handleEditCategory = () => {
    fetch(`http://localhost:4000/categories/${currentCategory._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentCategory),
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories();
        toggleEditModal();
      })
      .catch((error) => console.error("Error editing category:", error));
  };

  const handleDeleteCategory = () => {
    setDeleting(true);
    fetch(`http://localhost:4000/categories/${categoryToDelete._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories();
        setDeleting(false);
        toggleDeleteModal();
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        setDeleting(false);
      });
  };

  const handleDeleteButtonClick = (category) => {
    setCategoryToDelete(category);
    toggleDeleteModal();
  };

  const handleEditButtonClick = (category) => {
    setCurrentCategory(category);
    toggleEditModal();
  };

  const toggleExtras = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const isFormValid = (form) => {
    return form.name.trim() !== "";
  };

  return (
    <Row>
      {loading ? (
        <div
          role="status"
          className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <Card className="px-4 py-3">
          <Col lg="12">
            <div className="flex items-center justify-between pb-4">
              <p className="font-bold text-2xl">Categories</p>
              <Button color="primary" onClick={toggleModal}>
                Add New
              </Button>
            </div>
            <div className="w-full bg-gray-300 h-[1px] mb-5"></div>

            <Row>
              {categories.map((category) => (
                <Col sm="4" key={category._id} className="mb-4">
                  <Card>
                    <CardBody>
                      <p className="text-2xl font-semibold mb-2">
                        {category.name}
                      </p>
                      <p className="text-gray-500 mb-2 text-sm">
                        {category.description} 
                      </p>
                      {category.extras.length > 0 && (
                        <>
                        <p className="mt-3 mb-1 uppercase text-main text-sm">Extras:</p>
                        <div>
                          {expandedCategories[category._id]
                            ? category.extras.map((extra) => (
                                <div
                                  key={extra._id}
                                  className="w-full flex items-center justify-between text-sm border px-2 py-1 rounded-md mb-2"
                                >
                                  <p>{extra.name}</p>
                                  <p className="text-main font-semibold">
                                    {extra.price.toFixed(2)} €
                                  </p>
                                </div>
                              ))
                            : category.extras.slice(0, 5).map((extra) => (
                                <div
                                  key={extra._id}
                                  className="w-full flex items-center justify-between text-sm border px-2 py-1 rounded-md mb-2"
                                >
                                  <p>{extra.name}</p>
                                  <p className="text-main font-semibold">
                                    {extra.price.toFixed(2)} €
                                  </p>
                                </div>
                              ))}
                        </div>
                       </>
                      )}
                      {category.extras.length > 5 && (
                        <Button
                          color="link"
                          onClick={() => toggleExtras(category._id)}
                        >
                          {expandedCategories[category._id]
                            ? "Show Less"
                            : "Show More"}
                        </Button>
                      )}
                      <div className="mt-3 flex space-x-2 items-center">
                        <Button
                          className="flex-1"
                          onClick={() => handleEditButtonClick(category)}
                        >
                           <i className="bi bi-pencil-square mr-2"></i>Edit
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleDeleteButtonClick(category)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Add New Modal */}
            <Modal isOpen={modal} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>Add New Category</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="name">Category Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      placeholder="Enter category name"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      value={newCategory.description}
                      onChange={handleInputChange}
                      placeholder="Enter category description"
                      required
                    />
                  </FormGroup>
                  <p className="text-main uppercase mb-2">Extras:</p>
                  {newCategory.extras.map((extra, index) => (
                    <Row key={index}>
                      <Col md="5">
                        <FormGroup>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Extra name"
                            value={extra.name}
                            onChange={(e) => handleExtraChange(e, index)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="5">
                        <FormGroup>
                          <Input
                            type="number"
                            name="price"
                            placeholder="Extra price"
                            value={extra.price}
                            onChange={(e) => handleExtraChange(e, index)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2" className="d-flex align-items-center">
                        <Button
                          color="danger"
                          onClick={() => removeExtraField(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button onClick={() => addExtraField()}>
                  <i className="bi bi-plus-circle mr-2"></i> Add Extra
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="outline-secondary" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onClick={handleAddCategory}
                  disabled={!isFormValid(newCategory)}
                >
                  Add
                </Button>{" "}
              </ModalFooter>
            </Modal>
            {/* Edit Modal */}
            <Modal isOpen={editModal} toggle={toggleEditModal}>
              <ModalHeader toggle={toggleEditModal}>Edit Category</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="name">Category Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={currentCategory.name}
                      onChange={handleEditChange}
                      placeholder="Enter category name"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      value={currentCategory.description}
                      onChange={handleEditChange}
                      placeholder="Enter category description"
                      required
                    />
                  </FormGroup>
                  <p className="text-main uppercase mb-2">Extras:</p>
                  {currentCategory.extras.map((extra, index) => (
                    <Row key={index}>
                      <Col md="5">
                        <FormGroup>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Extra name"
                            value={extra.name}
                            onChange={(e) => handleExtraChange(e, index, true)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="5">
                        <FormGroup>
                          <Input
                            type="number"
                            name="price"
                            placeholder="Extra price"
                            value={extra.price}
                            onChange={(e) => handleExtraChange(e, index, true)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2" className="d-flex align-items-center">
                        <Button
                          color="danger"
                          onClick={() => removeExtraField(index, true)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button onClick={() => addExtraField(true)}>
                  <i className="bi bi-plus-circle mr-2"></i> Add Extra
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="outline-secondary" onClick={toggleEditModal}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onClick={handleEditCategory}
                  disabled={!isFormValid(currentCategory)}
                >
                  Update
                </Button>{" "}
              </ModalFooter>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
              <ModalHeader toggle={toggleDeleteModal}>
                Delete Category
              </ModalHeader>
              <ModalBody>
                Are you sure you want to delete the category "
                {categoryToDelete?.name}"?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={handleDeleteCategory}>
                  {deleting ? <Spinner size="sm" /> : "Yes, Delete"}
                </Button>{" "}
                <Button color="secondary" onClick={toggleDeleteModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Card>
      )}
    </Row>
  );
};

export default Categories;
