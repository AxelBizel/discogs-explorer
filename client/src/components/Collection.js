import React from "react";
import CollectionDisplay from "./CollectionDisplay";
import { Row } from "reactstrap";

function Collection() {
  return (
    <div id="Collection">
      <Row style={{ padding: "1vh 1vw", margin: "0 1vw" }}>
        <CollectionDisplay />
      </Row>
    </div>
  );
}

export default Collection;
