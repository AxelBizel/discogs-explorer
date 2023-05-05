import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Radar } from "react-chartjs-2";

const DashboardGenres = genres => {
  let genresArray = genres.genres
    .map(g => {
      for (let i = 0; i < g.length; i++) {
        if (g[i].includes("Folk")) g[i] = "Folk/World";
      }
      return g;
    })
    .join(",")
    .split(",")
    .sort();

  let graphLabels = [];
  let graphValues = [];

  for (let i = 0; i < genresArray.length; i++) {
    if (graphLabels.includes(genresArray[i])) {
      graphValues[graphLabels.indexOf(genresArray[i])] += 1;
    } else {
      graphLabels.push(genresArray[i]);
      graphValues.push(1);
    }
  }
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let sum = graphValues.reduce(reducer);
  let graphLabelsSliced = [];
  let graphValuesSliced = [];

  for (let i = 0; i < graphValues.length; i++) {
    if (graphValues[i] / sum > 0.03) {
      graphLabelsSliced.push(graphLabels[i]);
      graphValuesSliced.push(graphValues[i]);
    }
  }

  const data = {
    labels: graphLabelsSliced,
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
        data: graphValuesSliced
      }
    ]
  };

  // const options = {
  //   scale: {
  //     angleLines: {
  //       display: true
  //     },
  //     ticks: {
  //       display: true
  //     }
  //   },
  //   label:{
  //     display:false
  //   }
  // };

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
