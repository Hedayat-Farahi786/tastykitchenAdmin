import React, { useEffect, useState } from "react";
import { Card, CardBody, Table } from "reactstrap";

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

const ProjectTables = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for notifications from WebSocket server
    socket.on("new_order", (data) => {
      fetch("https://tastykitchen-backend.vercel.app/orders/dashboardOrders") // Replace with your actual endpoint
        .then((response) => response.json())
        .then((data) => {
          setTableData(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    // Fetch data from the API
    fetch("https://tastykitchen-backend.vercel.app/orders/dashboardOrders") // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
    <div>
      {loading === false ? (
        <Card>
          <CardBody>
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold">Orders</p>
              <Link to="/orders">
                <p className="text-sm underline cursor-pointer">
                  View All <i className="bi bi-arrow-right"></i>
                </p>
              </Link>
            </div>

            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Products</th>
                  <th>Note</th>
                  <th>Total Price</th>
                  <th>Payment</th>
                  <th>Customer</th>
                  {/* <th>Address</th> */}
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
                    <td>{order.totalPrice.toFixed(2)}€</td>
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
                    {/* <td>{order.delivery.street} 62A, {order.delivery.postcode} München</td> */}
                    <td>{formatDate(order.time)}</td>
                    <td>
                      <Link to={"/orders/" + order.orderNumber}>
                        <i className="bi bi-chevron-double-right text-main text-lg cursor-pointer"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <div
          role="status"
          class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
          <div class="flex items-center justify-between">
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
    </div>
  );
};

export default ProjectTables;
