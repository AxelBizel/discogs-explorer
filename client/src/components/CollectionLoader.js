import React, { useState, useEffect } from "react";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";

const CollectionLoader = ({ collectionLength, totalRelease }) => {
  const [percentageDisplayed, setPercentageDisplayed] = useState(0);

  useEffect(() => {
    if (collectionLength && totalRelease) {
      setPercentageDisplayed(
        Math.ceil((collectionLength / totalRelease) * 100)
      );
    }
  }, [collectionLength, totalRelease]);

  return (
    <>
      {collectionLength && totalRelease && percentageDisplayed < 100 && (
        <Container>
          <Row style={{ marginBottom: "2vh" }}>
            <Col>
              <p>
                Loading collection : {collectionLength} / {totalRelease} (
                {percentageDisplayed} %)
              </p>
              <Progress animated color="info" value={percentageDisplayed} />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default CollectionLoader;
