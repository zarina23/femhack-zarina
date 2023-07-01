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
  ResponsiveContainer,
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
    }, 120);

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

  const customTooltipContent = ({ active, payload, label }) => {
    console.log(payload);
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="desc">{`${payload[1].name}: ${(
            payload[1].value / 1000000
          ).toFixed(0)} M`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <section className="scatterChartSection">
        <div className="chartContainer">
          <ScatterChart
            className="scatterChart"
            width={630}
            height={370}
            margin={{
              top: 20,
              right: 30,
              left: 20,
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

            <ZAxis
              dataKey="total"
              range={[100, 750]}
              name="total"
              unit=" users"
            />
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
              name="Total Users Worldwide"
              data={chartData}
              fill="#0f90fe"
              opacity={0.9}
              shape="circle"
            />
          </ScatterChart>
        </div>
      </section>
    </>
  );
}

export default App;
