import { useState } from "react";

export default function ChartByYearAndCountry({ countriesList }) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  return (
    <div>
      <div className="container">
        <input
          type="text"
          className="col-md-12 input"
          onChange={(e) => onChangeHandler(e.target.value)}
          value={text}
        />
        {text}
      </div>
    </div>
  );
}
