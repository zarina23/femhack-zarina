import { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Dot,
  ResponsiveContainer,
} from "recharts";

import "../../App.css";

export default function ChartTopTen({ topTenCountriesList }) {
  const [topCountriesDataList, setTopCountriesDataList] = useState([]);
  const [activeCountry, setActiveCountry] = useState("");

  useEffect(() => {
    console.log(topTenCountriesList);
    getData(topTenCountriesList);
  }, [topTenCountriesList]);

  const getData = async (countriesList) => {
    const promiseList = [];

    for (let i = 0; i < countriesList.length; i++) {
      promiseList.push(fetch(`api/country/${countriesList[i]}`));
    }

    const responses = await Promise.all(promiseList);
    const data = await Promise.all(
      responses.map((response) => response.json())
    );
    console.log(data);

    const transformedData = [];
    const countries = {};

    // Iterate over the data array
    for (const item of data) {
      const country = item.Message.replace("Data from country `", "").replace(
        "`",
        ""
      );
      const yearsData = item.Data;

      // Iterate over each year's data
      for (const year in yearsData) {
        const internetUsersNumber = yearsData[year].internet_users_number;

        // If the year object doesn't exist, create it
        if (!countries[year]) {
          countries[year] = {
            name: year,
          };
        }

        // Add the country's internet users number to the year object
        countries[year][country] = internetUsersNumber;
      }
    }

    // Convert the countries object to an array of objects
    for (const year in countries) {
      transformedData.push(countries[year]);
    }

    // Remove years with 0 values for all countries
    const filteredData = transformedData.filter((yearData) => {
      // Check if any country has a non-zero internet users number
      const hasNonZeroValue = Object.values(yearData).some(
        (value) => typeof value === "number" && value !== 0
      );

      return hasNonZeroValue;
    });

    setTopCountriesDataList(filteredData);
  };

  const lineColors = [
    "#FF6363",
    "#FF63E2",
    "#AE63FF",
    "#4DB52B",
    "#2BB5A8",
    "#2B6FB5",
    "#6363FF",
    "#B5A82B",
    "#FFAE63",
    "#FF63A5",
  ];

  const yAxisFormatter = (value) => {
    return `${(value / 1000000).toFixed(0)} M`;
  };

  return (
    <div>
      <LineChart
        width={750}
        height={400}
        data={topCountriesDataList}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid sstroke="#ffffff" strokeDasharray="2 2" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#f3f1f5" }}
          tickCount={4}
          axisLine={{ stroke: "#f3f1f5" }}
        />
        <YAxis
          tickFormatter={yAxisFormatter}
          tickCount={6}
          tick={{ fill: "#f3f1f5" }}
          axisLine={{ stroke: "#f3f1f5" }}
        />
        <Tooltip />
        <Legend
          onMouseEnter={(e) => setActiveCountry(e)}
          onMouseLeave={() => setActiveCountry("")}
        />
        {topTenCountriesList &&
          topTenCountriesList.map((country, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={topTenCountriesList?.[i]}
              //   stroke={activeCountry === country ? "#8884d8" : "#ccc"}
              stroke={lineColors[i]}
              //   opacity={1}
              strokeWidth={3}
              dot={
                activeCountry === country ? <Dot r={8} fill="#8884d8" /> : null
              }
              activeDot={
                activeCountry === country ? <Dot r={8} fill="#8884d8" /> : null
              }
              onMouseEnter={() => setActiveCountry(country)}
              onMouseLeave={() => setActiveCountry("")}
            />
          ))}
      </LineChart>
    </div>
  );
}
