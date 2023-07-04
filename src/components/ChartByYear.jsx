import { useEffect, useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ZAxis,
} from "recharts";

import "../App.css";

export default function ChartByYear({ chartData, startYear, endYear }) {
  const yAxisFormatter = (value) => {
    return `${(value / 1000000).toFixed(0)} M`;
  };

  const customTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="desc">{`${payload[1].name}: ${(
            payload[1].value / 1000000
          ).toFixed(1)} M`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h3 className="chartTitle">Internet Users Per Year - Worldwide</h3>

      <ScatterChart
        className="scatterChart"
        width={630}
        height={370}
        margin={{
          top: 20,
          // right: 30,
          // left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid stroke="#ffffff" strokeDasharray="2 2" />
        <XAxis
          type="number"
          dataKey="name"
          name="Year"
          domain={[startYear, endYear + 1]}
          tickCount={8}
          allowDuplicatedCategory={false}
          wrapperStyle={{ lineHeight: "40px" }}
          tick={{ fill: "#f3f1f5" }}
          axisLine={{ stroke: "#f3f1f5" }}
        />
        <YAxis
          type="number"
          dataKey="total"
          name="Total Users"
          domain={[0, 5000000000]}
          tickFormatter={yAxisFormatter}
          tickCount={6}
          tick={{ fill: "#f3f1f5" }}
          axisLine={{ stroke: "#f3f1f5" }}
        />
        <ZAxis dataKey="total" range={[100, 750]} name="total" unit=" users" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          animationEasing="linear"
          content={customTooltipContent}
          // formatter={(value, name, props) => [value/1000000, name]}
        />
        <Legend
          fill="#0f90fe"
          opacity={1}
          wrapperStyle={{ lineHeight: "30px" }}
        />
        <Scatter
          name="Total Internet Users"
          data={chartData}
          fill="#0f90fe"
          opacity={0.9}
          shape="circle"
        />
      </ScatterChart>
    </div>
  );
}
