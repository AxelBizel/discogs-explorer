import React from "react";
import { Row, Col, Container } from "reactstrap";
import logoDiscogs from "../logoDiscogs.svg";
import Navigation from "./Navigation";

function Header() {
  return (
    <div id="Header">

    <Container>
      <Row>
        <Col style={{ margin: "5vh 1vw" }}>
          <h1 style={{ textAlign: "center" }}>
            Discogs{" "}
            <img src={logoDiscogs} alt="Discogs " style={{ width: "40px" }} />{" "}
            Explorer
          </h1>
        </Col>
      </Row>
      <Navigation />
    </Container>
    </div>
  );
}

export default Header;
