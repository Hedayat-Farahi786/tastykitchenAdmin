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
    <Card>
       {
            loading === false ? (
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
              <h4 className="mt-2 text-2xl font-bold">{salesData.yearTotalSales.toFixed(2)}€</h4>
            </Col>
            <Col md="3">
              <p className="text-sm">This Month</p>
              <h4 className="mt-2 text-2xl font-bold">{salesData.monthTotalSales.toFixed(2)}€</h4>
            </Col>
            <Col md="3">
              <p className="text-sm">This Week</p>
              <h4 className="mt-2 text-2xl font-bold">{salesData.weekTotalSales.toFixed(2)}€</h4>
            </Col>
            <Col md="3">
              <p className="text-sm">Today</p>
              <h4 className="mt-2 text-2xl font-bold">{salesData.dayTotalSales.toFixed(2)}€</h4>
            </Col>
          </Row>
           
        </div>
        <Chart options={options} series={salesData.monthlyOrderTotals} type="area" height="279" />
      </CardBody>
       ) : (<></>)
      }
    </Card>
  );
};

export default SalesChart;
