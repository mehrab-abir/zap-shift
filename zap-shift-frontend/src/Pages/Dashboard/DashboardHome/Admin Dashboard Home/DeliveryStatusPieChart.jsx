import React from 'react';
import {
  Legend,
  Tooltip,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import useAxios from '../../../../Hook/useAxios';
import { useQuery } from '@tanstack/react-query';

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

const DeliveryStatusPieChart = ({ isAnimationActive = true }) => {
  const axios = useAxios();

  //count parcels based on delivery status
  const { data, isLoading } = useQuery({
    queryKey: ["delivery-status"],
    queryFn: async () => {
      const response = await axios.get("/parcel-deliverystatus");
      return response.data;
    },
  });

  const pieData = data.map((d) => ({
    ...d,
    _id: d._id || "Parcel Request Placed",
  }));

  if (isLoading) {
    return <LoaderBar></LoaderBar>;
  }

  return (
    <div
      style={{ width: "100%", maxWidth: 500, height: 380 }}
      className="self-center"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            labelLine={false}
            label={renderCustomizedLabel}
            isAnimationActive={isAnimationActive}
          >
            {pieData?.map((entry, index) => (
              <Cell
                key={`cell-${entry._id ?? index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => [
              value,
              props?.payload?._id ?? "Parcel Request Placed",
            ]}
          />
          <Legend formatter={(value) => value || "Parcel Request Placed"} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryStatusPieChart;