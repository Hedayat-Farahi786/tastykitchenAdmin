import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Card,
  CardBody,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import cash from "../../assets/images/cash.png";
import credit from "../../assets/images/credit.png";
import paypal from "../../assets/images/paypal.png";
import io from "socket.io-client";
import { Link } from "react-router-dom";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"], // Explicitly use WebSocket transport
  reconnectionAttempts: 5,
  timeout: 20000,
  withCredentials: true,
});

const Orders = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    orderNumber: "",
    date: "",
  });

  useEffect(() => {
    // Listen for notifications from WebSocket server
    socket.on("new_order", (data) => {
      fetchData(currentPage, itemsPerPage, searchCriteria);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchData(currentPage, itemsPerPage, searchCriteria);
  }, [currentPage, itemsPerPage, searchCriteria]);

  const fetchData = (page, limit, criteria) => {
    setLoading(true);
    const query = new URLSearchParams({
      page,
      limit,
      ...criteria,
    }).toString();

    fetch(`https://tastykitchen-backend.vercel.app/orders?${query}`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data.orders); // Assuming the API returns an object with an "orders" field
        setTotalItems(data.total); // Assuming the API returns the total number of orders
    setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page whenever items per page changes
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1, itemsPerPage, searchCriteria);
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Row>
      {loading === false ? (
        <Col lg="12">
          <Card>
            <div
              className={`flex items-center justify-between pt-4 ${
                showFilters ? "" : "pb-4"
              } w-full px-4`}
            >
              <p className="font-bold text-2xl">All Orders</p>
              <div className="flex space-x-4">
                <Button
                  className="px-3"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i
                    className={`bi ${
                      showFilters ? "bi-x-lg" : "bi-funnel"
                    } mr-2`}
                  ></i>{" "}
                  {showFilters ? "Hide Filters" : "Filters"}
                </Button>

                <Button className="px-4" color="success">
                  <i className="bi bi-download mr-2"></i> Download
                </Button>
              </div>
            </div>
            <CardBody>
              {showFilters && (
                <Form onSubmit={handleSearchSubmit} className="pb-4">
                  <Row form>
                    <Col md={2}>
                      <FormGroup className="flex flex-col justify-end h-full">
                        <Label for="orderNumber">Order Number</Label>
                        <InputGroup>
                          <InputGroupText>#</InputGroupText>
                          <Input
                            type="text"
                            name="orderNumber"
                            id="orderNumber"
                            value={searchCriteria.orderNumber}
                            onChange={handleSearchChange}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    {/* <Col md={2}>
                  <FormGroup>
                    <Label for="customerName">Customer Name</Label>
                    <Input
                      type="text"
                      name="customerName"
                      id="customerName"
                      value={searchCriteria.customerName}
                      onChange={handleSearchChange}
                    />
                  </FormGroup>
                </Col> */}
                    {/* <Col md={2}>
                  <FormGroup>
                    <Label for="payment">Payment</Label>
                    <Input
                      type="select"
                      name="payment"
                      id="payment"
                      value={searchCriteria.payment}
                      onChange={handleSearchChange}
                    >
                      <option value="">All</option>
                      <option value="Barzahlung">Cash</option>
                      <option value="credit">Credit</option>
                      <option value="paypal">PayPal</option>
                    </Input>
                  </FormGroup>
                </Col> */}
                    <Col md={2}>
                      <FormGroup className="flex flex-col justify-end h-full">
                        <Label for="date">Date</Label>
                        <Input
                          type="date"
                          name="date"
                          id="date"
                          value={searchCriteria.date}
                          onChange={handleSearchChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2} className="flex items-end">
                      <Button type="submit" color="primary" className="px-4">
                        <i class="bi bi-search mr-2"></i> Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Products</th>
                    <th>Note</th>
                    <th>Total Price</th>
                    <th>Payment</th>
                    <th>Customer</th>
                    <th>Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((order, index) => (
                    <tr key={index} className="border-top">
                      <td>#{order.orderNumber}</td>
                      <td>
                        {order.products.map((product) => (
                          <div
                            key={product.productId._id}
                            className="flex flex-col space-y-4"
                          >
                            <div>
                              <span>{product.productId.name} </span>
                              <span className="text-sm text-main">
                                x{product.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td>
                        {order.delivery.note !== "" ? order.delivery.note : "-"}
                      </td>
                      <td>{order.totalPrice}€</td>
                      <td>
                        {order.payment === "Barzahlung" ? (
                          <img src={cash} alt="icon" className="w-6 ml-3" />
                        ) : order.payment === "paypal" ? (
                          <img src={paypal} alt="icon" className="w-6 ml-3" />
                        ) : (
                          <img src={credit} alt="icon" className="w-6 ml-3" />
                        )}
                      </td>
                      <td>{order.customer.name}</td>
                      <td>{formatDate(order.time)}</td>
                      <td>
                        <Link to={"/orders/" + order.orderNumber}>
                          <i className="bi bi-chevron-double-right text-main text-lg"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="w-full flex items-center justify-between">
                <p className="w-full">
                  Total Orders:{" "}
                  <span className="text-main font-semibold text-lg">
                    {totalItems}
                  </span>
                </p>
                <Pagination className="flex items-center justify-end">
                  <PaginationItem disabled={currentPage <= 1}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((page, i) => (
                    <PaginationItem active={i + 1 === currentPage} key={i}>
                      <PaginationLink onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem disabled={currentPage >= totalPages}>
                    <PaginationLink
                      next
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="form-select ml-3"
                    style={{ width: "auto" }} // Ensures the dropdown is compact
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </Pagination>
              </div>
            </CardBody>
          </Card>
        </Col>
      ) : (
        <div
          role="status"
          class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div class="h-4 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
            <div className="flex items-center space-x-5">
              <div class="h-8 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="h-8 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-5">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mt-3 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
              <div class="w-80 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-28"></div>
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      )}
    </Row>
  );
};

export default Orders;
