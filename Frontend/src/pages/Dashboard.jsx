import React, { useEffect, useState } from "react";
import "../stylings/pages/dashboard.css";
import Stack from "react-bootstrap/Stack";
import DashbaordCardComponent from "../components/DashbaordCardComponent";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Paper } from "@mui/material";

// Registering the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();

  // output of whole page
  return (
    <div className="body">
      <div className="outer-div">
        {/* //top row */}
        <div className="top">
          <div className="left">
            <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
              <h3>Dashboard</h3>
            </div>
          </div>
          <div className="right"></div>
        </div>
        
        {/* table part */}
        <div className="bottompart" style={{ width: "100%" }}>
          <Box
            sx={{ width: "100vw" }}
            display={"flex"}
            justifyContent={"space-around"}
          >
            <Chart1 />
            <Chart2 />
          </Box>
        </div>
      </div>
    </div>
  );
}

// Chart1 component to display the sales report as a line chart
function Chart1() {
  const [salesData, setSalesData] = useState([]);

// Fetch sales report data on component mount
  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/sales-report"
        );
        console.log(response.data.data);
        if (response.data.success) {
          setSalesData(response.data.data);
        } else {
          console.error("Error fetching sales report:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };
    fetchSalesReport();
  }, []);

  const renderChart = () => {
    const labels = salesData.map((item) => item.inv_id);
    const totalPrices = salesData.map((item) => item.totalPrice);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Total Sales",
          data: totalPrices,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          tension: 0.1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Sales Report",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Invoice ID",
          },
        },
        y: {
          title: {
            display: true,
            text: "Total Sales",
          },
        },
      },
    };

    return (
      <Box component={Paper} sx={{p:4,borderRadius:3}}>
        <Line style={{ width: "700px" }} data={data} options={options} />;
      </Box>
    );
  };

  return (
    <div>
      <h4>Sales Report</h4>
      {salesData.length > 0 ? renderChart() : <p>Loading...</p>}
    </div>
  );
}


// Chart2 component to display fast-moving medicines as a pie chart
function Chart2() {
  const [fastMovingData, setFastMovingData] = useState([]);

// Fetch fast-moving report data on component mount
  useEffect(() => {
    const fetchFastMovingReport = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/fastmoving-report"
        );
        console.log(response.data.data);
        if (response.data.success) {
          setFastMovingData(response.data.data);
        } else {
          console.error(
            "Error fetching fast-moving report:",
            response.data.error
          );
        }
      } catch (error) {
        console.error("Error fetching fast-moving report:", error);
      }
    };
    fetchFastMovingReport();
  }, []);

  const renderChart = () => {
    const labels = fastMovingData.map((item) => item.medicine_brandname);
    const totalSales = fastMovingData.map((item) => item.total_sales);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Total Sales",
          data: totalSales,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Fast Moving Medicines",
        },
      },
    };

    return (
      <Box component={Paper} sx={{p:4,borderRadius:3}}>
        <Pie style={{ width: "400px" }} data={data} options={options} />
      </Box>
    );
  };

  return (
    <div>
      <h4>Fast Moving Medicines</h4>
      {fastMovingData.length > 0 ? renderChart() : <p>Loading...</p>}
    </div>
  )
}
