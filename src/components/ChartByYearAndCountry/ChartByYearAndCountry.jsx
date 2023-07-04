import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import "./ChartByYearAndCountry.css";
import "../../App.css";
import { TextField } from "@mui/material";

export default function ChartByYearAndCountry({ countriesList }) {
  const [text, setText] = useState("");
  const [country, setCountry] = useState("Spain");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const [selectedOption, setSelectedOption] = useState([]);

  useEffect(() => {
    getUsersByCountry("Spain");
  }, []);

  const onButtonClick = () => {
    if (selectedYear) {
      getUsersByCountryAndYear(text, selectedYear);
    } else {
      getUsersByCountry(text);
    }
  };

  //API call to get get data by country AND year
  const getUsersByCountryAndYear = async (country, year) => {
    const response = await fetch(`api/country/${country}/year/${year}`);
    const data = await response.json();
    console.log(data);

    const yearVariable = data.Message.slice(-4);
    const totalUsers = data.Data[country].internet_users_number;
    const usersPercentage = data.Data[country].internet_users_percentatge;

    const formattedData = [
      {
        name: yearVariable,
        total: totalUsers,
        percentage: usersPercentage,
      },
    ];
    console.log(formattedData);

    setSelectedOption(formattedData);
    setCountry(country);
  };

  const getUsersByCountry = async (country) => {
    const response = await fetch(`api/country/${country}`);
    const data = await response.json();
    // console.log(data.Data);

    const dataArray = Object.entries(data.Data).map(([year, values]) => ({
      name: year,
      total: values.internet_users_number,
      percentage: values.internet_users_percentatge,
    }));

    //remove entries if no data
    const cleanDataArray = dataArray.filter(
      (entry) => entry.total && entry.percentage
    );
    // console.log(cleanDataArray)

    setSelectedOption(cleanDataArray);
    setCountry(country);
  };

  const onYearOptionHandler = (e) => {
    setSelectedYear(e.target.value);
  };

  let years = [];
  for (let year = 1990; year < 2021; year++) {
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
    // console.log(suggestion);
    setText(suggestion);
    setSuggestions([]);
  };

  const yAxisFormatter = (value) => {
    return `${(value / 1000000).toFixed(0)} M`;
  };

  const customTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Year: ${payload[0].payload.name}`}</p>
          <p className="desc">{`Total Users: ${(
            payload[0].payload.total / 1000000
          ).toFixed(2)} M`}</p>
          <p className="desc">{`% of Users: ${payload[0].payload.percentage.toFixed(
            2
          )} %`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h3 className="chartTitle">Internet Users - By Country</h3>

      <div className="container">
        <div className="formcontrol">
          <div className="inputSuggest">
            <TextField
              type="text"
              className="col-md-12 input"
              placeholder="Start typing country name"
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
          </div>

          {/* <InputLabel id="demo-simple-select-helper-label">Year</InputLabel> */}
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label="Year"
            // autoWidth
            className="select"
            onChange={(e) => onYearOptionHandler(e)}
            placeholder="year"
          >
            <option placeholder="Year"></option>
            {years.map((year, i) => {
              return (
                <MenuItem key={`year${i}`} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            onButtonClick();
          }}
        >
          Apply
        </Button>

        <h3 className="countryTitle">{country}</h3>
        <BarChart
          className="scatterChart"
          width={630}
          height={450}
          data={selectedOption}
          margin={{
            top: 20,
            // right: 30,
            // left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid stroke="#ffffff" strokeDasharray="2 2" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#f3f1f5" }}
            axisLine={{ stroke: "#f3f1f5" }}
          />
          <YAxis
            dataKey="total"
            tickFormatter={yAxisFormatter}
            tickCount={6}
            tick={{ fill: "#f3f1f5" }}
            axisLine={{ stroke: "#f3f1f5" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            animationEasing="linear"
            content={customTooltipContent}
          />
          <Legend
            fill="#0f90fe"
            opacity={1}
            wrapperStyle={{ lineHeight: "30px" }}
          />
          <Bar
            name="Total Internet Users"
            dataKey="total"
            fill="#0f90fe"
            opacity={0.9}
          />
        </BarChart>
      </div>
    </div>
  );
}
