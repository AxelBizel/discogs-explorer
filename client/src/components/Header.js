import React from "react";
import { Row, Col, Container } from "reactstrap";
import logoDiscogs from "../logoDiscogs.svg";
import Navigation from "./Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const location = window.location.pathname;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/");
  };

  return (
    <div id="Header">
      <Container>
        <Row>
          {(location === "/collection" || location === "/dashboard") && (
            <span
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faDoorOpen} color="white" size="lg" />
            </span>
          )}
          <Col style={{ margin: "5vh 1vw 2vh 1vw" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem" }}>
              Discogs{" "}
              <img src={logoDiscogs} alt="Discogs " style={{ width: "36px" }} />{" "}
              Explorer
            </h1>
          </Col>
        </Row>
        {(location === "/collection" || location === "/dashboard") && (
          <Navigation />
        )}
      </Container>
    </div>
  );
}

export default Header;
