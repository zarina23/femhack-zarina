import { useEffect, useState, useMemo } from "react";
import ChartByYear from "./components/ChartByYear";
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

  return (
    <>
      <section className="scatterChartSection">
        <div className="chartContainer">
          <ChartByYear
            chartData={chartData}
            startYear={startYear}
            endYear={endYear}
            setCurrentYear={setCurrentYear}
          />
        </div>
      </section>
    </>
  );
}

export default App;
