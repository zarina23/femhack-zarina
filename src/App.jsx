import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./App.css";

function App() {
  const [userDataByYear, setUserDataByYear] = useState([]);
  const startYear = 1990;
  const endYear = 2020;

  //on page load call the function that fetches data from the backend
  useEffect(() => {
    getUsersAllYears();
  }, []);

  const getUsersAllYears = async () => {
    //create a array to push the promises to
    const promiseList = [];

    //loop through all years available in the database
    for (let year = startYear; year <= endYear; year++) {
      //push each year's fetch responses into the array
      promiseList.push(fetch(`api/internet-users/${year}`));
    }

    //get responses from the promises and turn them into json format
    const responses = await Promise.all(promiseList);
    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    console.log(data);

    //clean the data array to turn it into the necessary format and set state
    const formattedData = data.map((usersPerYear) => {
      const year = usersPerYear.Message.slice(-4);
      const total = usersPerYear.Data.Total;

      return { name: [year], "Total Users": total };

    //   name: "Page G",
    // uv: 3490,
    // pv: 4300,
    // amt: 2100
    });
    setUserDataByYear(formattedData);
  };

  useEffect(() => {
    console.log(userDataByYear);
  }, [userDataByYear]);

  return (
    <>
      <LineChart
        width={500}
        height={300}
        data={userDataByYear}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke="#7F7C82" strokeDasharray="2 2" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Total Users"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </>
  );
}

export default App;
