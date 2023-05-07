import React from "react";
import { Spinner } from "reactstrap";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Spinner
        type="border"
        color="dark"
        style={{ width: 200, height: 200, marginTop: 200 }}
      />
    </div>
  );
}

export default Loader;
