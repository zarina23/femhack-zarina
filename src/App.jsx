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
import "./App.css";

function App() {
  const startYear = 1990;
  const endYear = 2020;
  const [userDataByYear, setUserDataByYear] = useState([]);
  const [currentYear, setCurrentYear] = useState(startYear);

  useEffect(() => {
    getUsersAllYears();
  }, []);

  const getUsersAllYears = async () => {
    const promiseList = [];

    for (let year = startYear; year <= endYear; year++) {
      promiseList.push(fetch(`api/internet-users/${year}`));
    }

    const responses = await Promise.all(promiseList);
    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    const formattedData = data.map((usersPerYear) => {
      const year = usersPerYear.Message.slice(-4);
      const total = usersPerYear.Data.Total;

      return { name: [year], total: total };
    });

    console.log(formattedData);

    setUserDataByYear(formattedData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear((prevYear) => {
        const nextYear = prevYear + 1;
        if (nextYear > endYear) {
          clearInterval(interval);
        }
        return nextYear;
      });
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const chartData = useMemo(() => {
    return userDataByYear.filter(
      (data) => parseInt(data.name[0]) <= currentYear
    );
  }, [userDataByYear, currentYear]);

  const yAxisFormatter = (value) => {
    return `${(value / 1000000).toFixed(0)} M`;
  };

  return (
    <>
      <ScatterChart
        width={500}
        height={300}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke="#7F7C82" strokeDasharray="2 2" />
        <XAxis
          type="number"
          dataKey="name"
          name="Year"
          domain={[startYear, endYear]}
        />
        <YAxis
          type="number"
          dataKey="total"
          name="Total Users"
          tickFormatter={yAxisFormatter}
        />

        <ZAxis
          dataKey="total"
          range={[50, 500]}
          name="Total Users"
          unit="users"
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        <Scatter
          name="Total Users"
          data={chartData}
          fill="#8884d8"
          shape="circle"
        />
      </ScatterChart>
    </>
  );
}

export default App;
