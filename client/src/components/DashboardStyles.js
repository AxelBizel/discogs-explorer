import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { HorizontalBar } from "react-chartjs-2";

const DashboardStyles = ({ styles }) => {
  console.log("styles", styles);

  const data = {
    labels: styles.map((s) => s.name),
    datasets: [
      {
        label: "Nombre de disques dans la collection",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: styles.map((s) => s.nb),
      },
    ],
  };

  return (
    <>
      {styles ? (
        <HorizontalBar data={data} width={100} height={375} />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </>
  );
};
export default DashboardStyles;
