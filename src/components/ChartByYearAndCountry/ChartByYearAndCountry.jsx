import { useState } from "react";
import "./ChartByYearAndCountry.css";

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
      </div>
    </div>
  );
}
