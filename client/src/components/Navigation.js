import React, { useState, useEffect } from "react";
import { Col, Nav, NavItem, NavLink } from "reactstrap";
import { connect } from "react-redux";
import { isLoggedIn } from "../actions";
import Axios from "axios";


const Navigation = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  useEffect(() => {
    if (!loggedIn) {
      Axios.post("http://localhost:8080/api/logout", { userName: "" });
    }
    console.log("loggedIn", loggedIn);
  }, [loggedIn]);

  return (
    <div>
      <Nav tabs>
        <Col>
          <NavItem>
            <NavLink href="/collection">Collection</NavLink>
          </NavItem>
        </Col>
        <Col>
          <NavItem>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </NavItem>
        </Col>
        <Col>
          <NavItem>
            <NavLink href="/explore">Explore</NavLink>
          </NavItem>
        </Col>
        <Col>
          <NavItem>
            <NavLink href="/" onClick={() => setLoggedIn(false)}>
              Logout
            </NavLink>
          </NavItem>
        </Col>
      </Nav>
    </div>
  );
};

function mdtp(dispatch) {
  return {
    isLoggedIn: (isLoggedIn) => {
      dispatch(isLoggedIn(isLoggedIn));
    },
  };
}
export default connect(null, mdtp)(Navigation);
