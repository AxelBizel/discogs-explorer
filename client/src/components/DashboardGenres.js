import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Radar } from "react-chartjs-2";

const DashboardGenres = ({ genres }) => {
  const data = {
    labels: genres.map((g) =>
      g.name.replace("Folk, World, & Country", "Folk/World")
    ),
    aspectRatio: 1,
    datasets: [
      {
        label: "Nombre de disques dans la collection",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        pointBorderColor: "#fff",

        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: genres.map((g) => g.nb),
      },
    ],
  };

  return (
    <>
      {genres ? (
        <Radar data={data} width={100} height={100} />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </>
  );
};
export default DashboardGenres;
