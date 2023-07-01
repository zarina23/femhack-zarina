import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./ChartByYearAndCountry.css";

export default function ChartByYearAndCountry({ countriesList }) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);

  const [selectedOption, setSelectedOption] = useState([]);

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  //API call to get get data by country AND year
  const getUsersByCountryAndYear = async (country, year) => {
    console.log(country, year);
    const response = await fetch(`api/country/${country}/year/${year}`);
    const data = await response.json();

    const yearVariable = data.Message.slice(-4);
    const totalUsers = data.Data.internet_users_number;
    const usersPercentage = data.Data.internet_users_percentatge;

    const formattedData = {
      name: [yearVariable],
      total: [totalUsers],
      percentage: [usersPercentage],
    };
    console.log(formattedData);

    setSelectedOption(formattedData);
  };

  const onYearOptionHandler = (e) => {
    setSelectedYear(e.target.value);
  };

  const onButtonClick = () => {
    console.log(selectedYear);
    getUsersByCountryAndYear(text, selectedYear);
  };

  let years = [];
  for (let year = 1980; year < 2021; year++) {
    years.push(year);
  }

  const onChangeHandler = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = countriesList.filter((country) => {
        const regex = new RegExp(`^${text}`, "i");
        return country.match(regex);
      });
    }

    console.log(matches);

    setSuggestions(matches);
    setText(text);
  };

  const onSuggestHandler = (suggestion) => {
    console.log(suggestion);
    setText(suggestion);
    setSuggestions([]);
  };

  return (
    <div>
      <div className="container">
        <input
          type="text"
          className="col-md-12 input"
          onChange={(e) => onChangeHandler(e.target.value)}
          value={text}
          onBlur={() => {
            setTimeout(() => {
              setSuggestions([]);
            }, 200);
          }}
        />
        {suggestions &&
          suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="suggestion col-md-12 justify-content-md-center"
              onClick={() => onSuggestHandler(suggestion)}
            >
              {suggestion}
            </div>
          ))}

        <select onChange={(e) => onYearOptionHandler(e)}>
          <option placeholder="Year"></option>
          {years.map((year, i) => {
            return (
              <option key={`year${i}`} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <button
          onClick={() => {
            onButtonClick();
          }}
        >
          Search
        </button>

        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}
