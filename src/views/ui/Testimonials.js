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
} from "reactstrap";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    content: "",
  });
  const [newTestimonial, setNewTestimonial] = useState({
    firstName: "",
    lastName: "",
    content: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = () => {
    setLoading(true);
    fetch("http://localhost:4000/testimonials")
      .then((response) => response.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching testimonials:", error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleModal = () => setModal(!modal);
  const toggleEditModal = () => setEditModal(!editModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentTestimonial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTestimonial = () => {
    const newAuthor = `${newTestimonial.firstName} ${newTestimonial.lastName}`;
    const newTestimonialData = { author: newAuthor, content: newTestimonial.content };

    fetch("http://localhost:4000/testimonials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTestimonialData),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTestimonials();
        toggleModal();
        setNewTestimonial({ firstName: "", lastName: "", content: "" });
      })
      .catch((error) => console.error("Error adding testimonial:", error));
  };

  const handleEditTestimonial = () => {
    const updatedAuthor = `${currentTestimonial.firstName} ${currentTestimonial.lastName}`;
    const updatedTestimonialData = {
      ...currentTestimonial,
      author: updatedAuthor,
    };

    fetch(`http://localhost:4000/testimonials/${currentTestimonial._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTestimonialData),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTestimonials();
        toggleEditModal();
      })
      .catch((error) => console.error("Error editing testimonial:", error));
  };

  const handleDeleteTestimonial = (id) => {
    fetch(`http://localhost:4000/testimonials/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchTestimonials();
      })
      .catch((error) => console.error("Error deleting testimonial:", error));
  };

  const handleEditButtonClick = (testimonial) => {
    const [firstName, lastName] = testimonial.author.split(" ");
    setCurrentTestimonial({ ...testimonial, firstName, lastName });
    toggleEditModal();
  };

  const isFormValid = (form) => {
    return form.firstName && form.lastName && form.content;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()} - ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    return formattedDate;
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
            <p className="font-bold text-2xl">Testimonials</p>
            <Button color="primary" onClick={toggleModal}>
              Add New
            </Button>
          </div>
          <div className="w-full bg-gray-300 h-[1px] mb-4"></div>

          <Form className="pb-4">
            <FormGroup className="flex flex-col justify-end h-full">
              {/* <Label for="search">Search by Author</Label> */}
              <Input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by author"
              />
            </FormGroup>
          </Form>
          <Row>
            {filteredTestimonials.map((testimonial) => (
              <Col sm="4" key={testimonial._id} className="mb-4">
                <Card>
                  <CardBody>
                   <div className="flex items-center space-x-3 mb-2">
                    <div className="border rounded-full w-8 h-8 flex items-center justify-center"><p className="text-xs font-semibold text-main tracking-wider"> {testimonial.author.split(" ").map(name => name.charAt(0).toUpperCase()).join("")}</p></div>
                   <p className="font-semibold text-lg">{testimonial.author}</p>
                   </div>
                    <p className="mb-2">{testimonial.content}</p>
                    <small>{formatDate(testimonial.createdAt)}</small>
                    <div className="mt-2 flex items-center justify-end space-x-2">
                      <Button
                        onClick={() => handleEditButtonClick(testimonial)}
                      >
                       <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleDeleteTestimonial(testimonial._id)}
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
            <ModalHeader toggle={toggleModal}>Add New Testimonial</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={newTestimonial.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={newTestimonial.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="content">Content</Label>
                  <Input
                    type="textarea"
                    name="content"
                    id="content"
                    value={newTestimonial.content}
                    onChange={handleInputChange}
                    placeholder="Enter testimonial content"
                    rows="10"
                    required
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={handleAddTestimonial}
                disabled={!isFormValid(newTestimonial)}
              >
                Add
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          {/* Edit Modal */}
          <Modal isOpen={editModal} toggle={toggleEditModal}>
            <ModalHeader toggle={toggleEditModal}>Edit Testimonial</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={currentTestimonial.firstName}
                    onChange={handleEditChange}
                    placeholder="Enter first name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={currentTestimonial.lastName}
                    onChange={handleEditChange}
                    placeholder="Enter last name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="content">Content</Label>
                  <Input
                    type="textarea"
                    name="content"
                    id="content"
                    value={currentTestimonial.content}
                    onChange={handleEditChange}
                    placeholder="Enter testimonial content"
                    rows="10"
                    required
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={handleEditTestimonial}
                disabled={!isFormValid(currentTestimonial)}
              >
                Save
              </Button>{" "}
              <Button color="secondary" onClick={toggleEditModal}>
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

export default Testimonials;
