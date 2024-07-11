import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    setLoading(true);
    fetch("https://tastykitchen-backend.vercel.app/contacts")
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching contacts:", error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const csvData = contacts.map((contact) => ({
      Name: contact.name,
      Email: contact.email,
      Message: contact.message,
      CreatedAt: new Date(contact.createdAt).toLocaleString(),
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((e) => Object.values(e).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);

    link.click();
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
        <Col lg="12">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between pb-4">
                <p className="font-bold text-2xl">Contact Information</p>
                <div className="flex space-x-4">
                  <Button
                    className="px-4"
                    color="success"
                    onClick={handleDownload}
                  >
                    <i className="bi bi-download mr-2"></i> Download
                  </Button>
                </div>
              </div>
              <div className="w-full bg-gray-300 h-[1px] mb-4"></div>

              <Form className="pb-4">
                <FormGroup className="flex flex-col justify-end h-full">
                  {/* <Label for="search">Search</Label> */}
                  <Input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name, email, or message"
                  />
                </FormGroup>
              </Form>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Received At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.message}</td>
                      <td>{formatDate(contact.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default Contacts;
