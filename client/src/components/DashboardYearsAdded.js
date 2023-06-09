import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";

const DashboardYearsAdded = ({ yearsAdded }) => {
  const data = {
    labels: yearsAdded.map((y) => y.date),

    datasets: [
      {
        fill: true,
        lineTension: 0.2,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: yearsAdded.map((y) => y.count),
        label: "Nombre de disques dans la collection",
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "year",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginsAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      {yearsAdded ? (
        <Line
          data={data}
          width={100}
          height={100}
          legend={{ display: false }}
          options={options}
        />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </>
  );
};
export default DashboardYearsAdded;
