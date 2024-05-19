import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { colorOptions } from "../options";

interface Filament {
  id: number;
  size: number;
  amount_used: number;
  material: string;
  colour_name: string;
}

const FilamentUsageChart: React.FC = () => {
  const [filamentData, setFilamentData] = useState<Filament[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFilamentData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/filaments`);
        setFilamentData(response.data);
      } catch (error) {
        console.error("Error fetching filament data:", error);
      }
    };

    fetchFilamentData();
  }, [apiUrl]);

  const colorMap: { [key: string]: string } = {
    black: "#000000",
    blue: "#0000FF",
    lavender: "#E6E6FA",
    pink: "#FFC0CB",
    green: "#008000",
    yellow: "#FFFF00",
  };

  const chartData = colorOptions.map((color) => {
    const filament = filamentData.find((f) => f.colour_name === color);
    return {
      name: `${color} (${filament ? filament.material : "N/A"})`,
      remaining: filament ? filament.size - filament.amount_used : 0,
      fill: colorMap[color],
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="remaining"
          name="Remaining Filament"
          isAnimationActive={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FilamentUsageChart;
