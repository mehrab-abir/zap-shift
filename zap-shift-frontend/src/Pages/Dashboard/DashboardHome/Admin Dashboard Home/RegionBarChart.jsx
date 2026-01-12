import React from "react";
import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";
import useAxios from "../../../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import LoaderBar from "../../../../Shared Components/LoaderBar";

const RegionBarChart = ({ isAnimationActive = true }) => {
  const axios = useAxios();

  //parcels by region
  const { data: parcelRegion } = useQuery({
    queryKey: ["parcel-region"],
    queryFn: async () => {
      const response = await axios.get("/parcels-by-region");
      return response.data;
    },
  });

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-2">Parcels sent by region:</h2>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={parcelRegion}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis width="count" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="count"
          fill="#8884d8"
          isAnimationActive={isAnimationActive}
        />
      </BarChart>
    </div>
  );
};

export default RegionBarChart;
