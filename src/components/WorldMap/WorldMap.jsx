import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import lookup_table from "../../../public/lookup_table.json";

const WorldMap = ({ mapData, minAndMaxArray }) => {
  const geoUrl = "../../../public/features.json";

  const colorScale = scaleLinear()
    .domain(minAndMaxArray)
    .range(["rgb(189, 224, 255)", "rgba(15, 144, 254, 1)"]);

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {mapData.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const extractedCountryDetails = mapData.find(
                (countryDetails) =>
                  lookup_table[countryDetails.countryName] === geo.id
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    extractedCountryDetails
                      ? colorScale(extractedCountryDetails.internetUsers2020)
                      : "#F5F4F6"
                  }
                />
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default WorldMap;
