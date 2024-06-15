import { Card, CardBody, CardSubtitle, CardTitle, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch data from the API
    fetch("https://tastykitchen-backend.vercel.app/orders/sales") // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => {
        setSalesData(data);
          setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    legend: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 2,
      },
    },
    colors: ["#ff2929", "#ff5959", "#ff7a7a"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
              borderRadius: 7,
            },
          },
        },
      },
    ],
  };

  return (
    <>
      {loading === false ? (
        <Card>
        <CardBody>
          {/* <CardTitle tag="h5">Sales Summary</CardTitle> */}
          <p className="font-semibold">Sales Summary</p>
          {/* <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report
        </CardSubtitle> */}
          <div className="bg-primary text-white my-3 p-3 rounded">
            <Row>
              <Col md="3">
                <p className="text-sm">Total Sales</p>
                <h4 className="mt-2 text-2xl font-bold">
                  {salesData.yearTotalSales.toFixed(2)}€
                </h4>
              </Col>
              <Col md="3">
                <p className="text-sm">This Month</p>
                <h4 className="mt-2 text-2xl font-bold">
                  {salesData.monthTotalSales.toFixed(2)}€
                </h4>
              </Col>
              <Col md="3">
                <p className="text-sm">This Week</p>
                <h4 className="mt-2 text-2xl font-bold">
                  {salesData.weekTotalSales.toFixed(2)}€
                </h4>
              </Col>
              <Col md="3">
                <p className="text-sm">Today</p>
                <h4 className="mt-2 text-2xl font-bold">
                  {salesData.dayTotalSales.toFixed(2)}€
                </h4>
              </Col>
            </Row>
          </div>
          <Chart
            options={options}
            series={salesData.monthlyOrderTotals}
            type="area"
            height="279"
          />
        </CardBody>
        </Card>
      ) : (
          <div
            role="status"
            class="w-full p-4 mb-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
          >
            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-32 mb-2.5"></div>
            <div class="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-400"></div>
            <div class="flex items-baseline mt-4">
              <div class="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-400"></div>
              <div class="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-400"></div>
              <div class="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-400"></div>
              <div class="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-400"></div>
              <div class="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-400"></div>
              <div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-400"></div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
      )}
    </>
  );
};

export default SalesChart;
