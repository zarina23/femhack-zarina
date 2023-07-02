import { useEffect, useState, useMemo } from "react";
import ChartByYear from "./components/ChartByYear";
import ChartByYearAndCountry from "./components/ChartByYearAndCountry/ChartByYearAndCountry";
import ChartTopTen from "./components/ChartTopTen/ChartTopTen";
import "./App.css";

function App() {
  //state for first chart
  const startYear = 1990;
  const endYear = 2020;
  const [userDataByYear, setUserDataByYear] = useState([]);
  const [currentYear, setCurrentYear] = useState(startYear);
  //state for second chart
  const [countriesList, setCountriesList] = useState([]);
  //state for third chart
  const [topTenCountriesList, setTopTenCountriesList] = useState([]);

  useEffect(() => {
    getUsersAllYears();
    getCountries();
  }, []);

  //code for the first chart - total users per year
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

  //code for the second chart - users per year by country
  //API call to get the list of countries
  const getCountries = async () => {
    try {
      const response = await fetch("api/countries");
      const data = await response.json();

      //set state with fetched data
      setCountriesList(data.Countries);
    } catch (err) {
      console.log(err);
    }
  };

  //API call to get top 10 countries
  const getTopCountries = async (countriesList) => {
    const promiseList = [];

    for (let i = 0; i < countriesList.length; i++) {
      promiseList.push(fetch(`api/country/${countriesList[i]}`));
    }

    const responses = await Promise.all(promiseList);
    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    const totalByCountryArray = data.map((item) => {
      const yearsData = item.Data; // Object containing data for each year
      const country = item.Message.replace("Data from country `", "").replace(
        "`",
        ""
      ); // Extract country name

      // Calculate total internet users for all years
      const totalInternetUsers = Object.values(yearsData).reduce(
        (total, yearData) => {
          return total + yearData.internet_users_number;
        },
        0
      );

      // Create the transformed object
      return {
        country: country,
        total_internet_users_all_years: totalInternetUsers,
      };
    });

    // console.log(totalByCountryArray);

    const topTenCountriesArray = totalByCountryArray
      .sort(
        (a, b) =>
          b.total_internet_users_all_years - a.total_internet_users_all_years
      )
      .slice(0, 10);

    // console.log(topTenCountriesArray.map((country) => country.country));
    return topTenCountriesArray.map((country) => country.country);
  };

  useEffect(() => {
    if (countriesList.length > 0) {
      const fetchTopCountries = async () => {
        const topCountries = await getTopCountries(countriesList);
        setTopTenCountriesList(topCountries);
      };

      fetchTopCountries();
    }
  }, [countriesList]);

  return (
    <div className="App">
      <section className="chartByYear">
        <div className="chartContainer">
          <ChartByYear
            chartData={chartData}
            startYear={startYear}
            endYear={endYear}
            setCurrentYear={setCurrentYear}
          />
        </div>
      </section>

      <section className="chartByYear">
        <div className="chartContainer">
          <ChartByYearAndCountry countriesList={countriesList} />
        </div>{" "}
      </section>

      <section className="chartByYear">
        <div className="chartContainer">
          <ChartTopTen topTenCountriesList={topTenCountriesList} />
        </div>{" "}
      </section>
    </div>
  );
}

export default App;
