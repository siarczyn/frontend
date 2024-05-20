import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import {
  startOfYear,
  eachWeekOfInterval,
  format,
  getISOWeek,
  isBefore,
  endOfToday,
} from "date-fns";

interface Order {
  id: number;
  date_of_order: string;
}

interface ChartData {
  week: string;
  orders: number;
}

const OrdersPerWeekChart: React.FC = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/data`);
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [apiUrl]);

  useEffect(() => {
    if (orderData.length > 0) {
      const currentYear = new Date().getFullYear();
      const startOfYearDate = startOfYear(new Date(currentYear, 0, 1));
      const endOfTodayDate = endOfToday();

      const weeks = eachWeekOfInterval({
        start: startOfYearDate,
        end: endOfTodayDate,
      });

      const ordersPerWeek = weeks.map((weekStart) => {
        const weekNumber = getISOWeek(weekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const ordersInWeek = orderData.filter((order) => {
          const orderDate = new Date(order.date_of_order);
          return orderDate >= weekStart && orderDate <= weekEnd;
        }).length;

        return {
          week: format(weekStart, "MMM d"),
          orders: ordersInWeek,
        };
      });

      setChartData(ordersPerWeek);
    }
  }, [orderData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week">
          <Label value="Week" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label
            value="Orders"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersPerWeekChart;
