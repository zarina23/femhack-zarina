import { useEffect, useState, useMemo } from "react";
import ChartByYear from "./components/ChartByYear";
import ChartByYearAndCountry from "./components/ChartByYearAndCountry";
import "./App.css";

function App() {
  //state for first chart
  const startYear = 1990;
  const endYear = 2020;
  const [userDataByYear, setUserDataByYear] = useState([]);
  const [currentYear, setCurrentYear] = useState(startYear);
  //state for second chart
  const [countriesList, setCountriesList] = useState([]);

  //code for the first chart - total users per year
  useEffect(() => {
    getUsersAllYears();
    getCountries();
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
      setCountriesList(data.Countries)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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

      <section className="chartByYearAndCountry">
        {/* {countriesList.map(country => <p>{country}</p>)} */}
        <ChartByYearAndCountry countriesList={countriesList}/>
      </section>
    </>
  );
}

export default App;
