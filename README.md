# femhack-solution

This is the README file for the `femhack-solution` package.

## Description

The `femhack-solution` package is a solution developed for the FemHack coding challenge. It is a web application built using React and various related libraries. The application includes visualizations using D3, interactive maps with Leaflet, and charts with Recharts. It also utilizes the Material-UI library for styling.

## Screen captures

Internet Users Worldwide Chart
![Worldwide users historical data](./src/assets/worldwide.gif)

## Installation

To install and use the `femhack-solution` package, you need to have Node.js installed on your machine. Follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the root directory of the cloned repository.
3. Run the following command to install the dependencies:

- `npm install`

## Usage

Once you have installed the dependencies, you can use the following npm scripts to run and build the application:

- `npm run dev`: Runs the application in development mode using Vite.
  After running this command, the terminal will give you the link to `http://localhost:`, copy the link, open your web browser and navigate to that link to view the application.

## Data Range

The backend for the hackathon has information from 1980 to 2020. However, please note that the application displays data from 1990 to 2020. This limitation is due to the fact that the data for the years 1980 to 1989 is not populated in the backend.

## Dependencies

The `femhack-solution` package has the following dependencies:

- `@emotion/react`: Version 11.11.1
- `@emotion/styled`: Version 11.11.0
- `@mui/material`: Version 5.13.6
- `d3`: Version 7.8.5
- `leaflet`: Version 1.9.4
- `react`: Version 18.2.0
- `react-dom`: Version 18.2.0
- `react-simple-maps`: Version 3.0.0
- `recharts`: Version 2.7.2

## Dev Dependencies

The `femhack-solution` package has the following dev dependencies:

- `@types/react`: Version 18.0.37
- `@types/react-dom`: Version 18.0.11
- `@vitejs/plugin-react`: Version 4.0.0
- `eslint`: Version 8.38.0
- `eslint-plugin-react`: Version 7.32.2
- `eslint-plugin-react-hooks`: Version 4.6.0
- `eslint-plugin-react-refresh`: Version 0.3.4
- `vite`: Version 4.3.9

## License

This package is private and does not have a specified license.
