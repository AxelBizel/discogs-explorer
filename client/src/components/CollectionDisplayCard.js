import React, { useState, useEffect } from "react";
import {
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap";

function CollectionDisplayCard(props) {
  const { item, index } = props;
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(min-width: 992px)").matches) {
      setDelay((index % 4) * 200);
    } else if (window.matchMedia("(min-width: 768px)").matches) {
      setDelay((index % 2) * 200);
    }
  }, [index]);

  return (
    <>
      <Col
        xs="12"
        sm="6"
        lg="3"
        key={index}
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-delay={delay}
      >
        <Card style={{ margin: "1vh 1vw" }}>
          <CardImg
            top
            width="100%"
            src={`${item.cover_image}`}
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
              {item.artists.map(artist => `${artist.name} `)}
            </CardTitle>
            <CardSubtitle>{item.title}</CardSubtitle>
            <CardText style={{ fontStyle: "italic", fontSize: "0.8em" }}>
              Label(s): {item.labels.map(label => `${label.name} `)} <br></br>
              Année : {item.year} <br></br>
              Format(s) : {item.formats.map(format => `${format.name} `)}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

export default CollectionDisplayCard;
