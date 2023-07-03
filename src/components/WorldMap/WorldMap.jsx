import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import Tooltip from "@mui/material/Tooltip";
import lookup_table from "../../../public/lookup_table.json";
import "../../App.css";
import "./WorldMap.css";

const WorldMap = ({ mapData, minAndMaxArray }) => {
  const geoUrl = "../../../public/features.json";

  const colorScale = scaleLinear()
    .domain(minAndMaxArray)
    .range(["#a6caef", "#0263c4"]);

  const showTooltip = (countryDetails) => {
    console.log(countryDetails);

    return (
      <div className="custom-tooltip tooltip">
        <p className="label tooltiptext">{`${countryDetails?.countryName}`}</p>
        <p className="desc">{`Number of Internet Users: ${(
          countryDetails?.internetUsers2020 / 1000000
        ).toFixed(2)} M`}</p>
      </div>
    );
  };
  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 140,
      }}
    >
      <Sphere stroke="#f3f1f5" strokeWidth={0.5} />
      <Graticule stroke="#f3f1f5" strokeWidth={0.5} />
      {mapData.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const extractedCountryDetails = mapData.find(
                (countryDetails) =>
                  lookup_table[countryDetails.countryName] === geo.id
              );
              return (
                <Tooltip
                  key={geo.rsmKey}
                  title={`${
                    extractedCountryDetails?.countryName
                  }, % of users: ${extractedCountryDetails?.internetUsers2020.toFixed(
                    1
                  )}%`}
                >
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: extractedCountryDetails
                          ? colorScale(
                              extractedCountryDetails.internetUsers2020
                            )
                          : "#F5F4F6",
                      },
                      hover: { fill: "#041145" },
                      pressed: { fill: "rgba(15, 144, 254, 1)" },
                    }}
                    onMouseEnter={() => showTooltip(geo)}
                  />
                </Tooltip>
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default WorldMap;
