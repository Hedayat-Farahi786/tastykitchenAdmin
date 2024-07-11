import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  ListGroupItem,
  ListGroup,
  Button,
} from "reactstrap";

import cash from "../../assets/images/cash.png";
import credit from "../../assets/images/credit.png";
import paypal from "../../assets/images/paypal.png";

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [extras, setExtras] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch the order data from the API
    fetch(`https://tastykitchen-backend.vercel.app/orders/${orderNumber}`) // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [orderNumber]);

  function formatDate(dateString) {
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
  }

  return (
    <>
      {loading === false ? (
        <Row>
          {order && (
            <Col>
              <Card>
                <CardTitle
                  tag="h2"
                  className="border-bottom p-3 mb-0 flex items-center justify-between w-full"
                >
                  <div className="text-2xl font-semibold">
                    <i className="bi bi-left-arrow me-2"> </i>
                    Order{" "}
                    <span className="text-main">#{order.orderNumber}</span>
                  </div>
                  <p>{formatDate(order.time)}</p>
                </CardTitle>
                <CardBody className="p-5">
                  {order ? (
                    <div>
                      <div className="flex flex-wrap">
                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Order Number
                          </p>
                          <p className="text-lg font-semibold">
                            #{order.orderNumber}
                          </p>
                        </div>

                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Customer
                          </p>
                          <p className="text-lg font-semibold">
                            {order.customer.name}
                          </p>
                        </div>

                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Address
                          </p>
                          <p className="text-lg font-semibold">
                            {order.delivery.street}, {order.delivery.postcode}{" "}
                            München
                          </p>
                        </div>

                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Phone
                          </p>
                          <p className="text-lg font-semibold">
                            {order.customer.phone}
                          </p>
                        </div>

                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Payment
                          </p>
                          {order.payment === "Barzahlung" ? (
                            <img src={cash} alt="icon" className="w-6 ml-3" />
                          ) : order.payment === "paypal" ? (
                            <img src={paypal} alt="icon" className="w-6 ml-3" />
                          ) : (
                            <img src={credit} alt="icon" className="w-6 ml-3" />
                          )}
                        </div>

                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Total
                          </p>
                          <p className="text-lg font-semibold">
                            {order.totalPrice.toFixed(2)}€
                          </p>
                        </div>

                        <div className="flex flex-col mr-10 mb-4 space-y-1">
                          <p className="text-gray-400 text-sm uppercase">
                            Delivery Note
                          </p>
                          <p className="text-lg font-semibold">
                            {order.delivery.note === ""
                              ? "-"
                              : order.delivery.note}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xl font-semibold">Products</p>
                        <ListGroup>
                          {order.products.map((product) => (
                            <ListGroupItem key={product.productId?._id}>
                              <div className="w-full flex items-center justify-between">
                                <div className="flex items-center space-x-5">
                                  <div className="flex items-center space-x-5">
                                    <img
                                      className="w-16 h-16 rounded"
                                      style={{ objectFit: "cover" }}
                                      src={product.productId?.image}
                                      alt={product.productId?.name}
                                    />
                                    <p className="text-lg">
                                      <span>{product.productId?.name}</span>{" "}
                                      <span className="text-main">
                                        x{product.quantity}
                                      </span>
                                    </p>
                                  </div>
                                  <div>
                                    {product.extras &&
                                      product.extras.length > 0 && (
                                        <p className="text-sm text-gray-500">
                                          mit{" "}
                                          {product.extras
                                            .map(
                                              (extraId) =>
                                                product.productId.menuId.extras.find(
                                                  (extra) =>
                                                    extra._id === extraId
                                                )?.name
                                            )
                                            .filter(Boolean)
                                            .join(", ")}
                                        </p>
                                      )}
                                  </div>
                                </div>
                                <p className="font-semibold ml-5">
                                  {product.price.toFixed(2)}€
                                </p>
                              </div>
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      </div>

                      <div className="mt-5 w-full flex items-center justify-end">
                        <Button outline className="px-4" color="success">
                          <i className="bi bi-download mr-2"></i> Download
                          Invoice
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p>Loading order details...</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      ) : (
        <div
          role="status"
          class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div class="h-5 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
            <div className="flex items-center space-x-5">
              <div class="h-3 bg-gray-300 rounded-full dark:bg-gray-300 w-40 mb-2.5"></div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-4 py-10">
            <div className="flex space-x-10">
              <div className="flex flex-col space-y-1">
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-28 mt-3 mb-2.5"></div>
                <div class="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-28 mt-3 mb-2.5"></div>
                <div class="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-28 mt-3 mb-2.5"></div>
                <div class="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-28 mt-3 mb-2.5"></div>
                <div class="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-28 mt-3 mb-2.5"></div>
                <div class="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-28 mt-3 mb-2.5"></div>
                <div class="w-40 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
              </div>
            </div>
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
    </>
  );
};

export default OrderDetail;
