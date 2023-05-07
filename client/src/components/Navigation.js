import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
// import CollectionSort from "./CollectionSort";
// import CollectionFilter from "./CollectionFilter";

const Navigation = () => {
  // const location = window.location.pathname;
  return (
    <div>
      <Nav tabs fill>
        <NavItem>
          <NavLink href="/collection">Collection</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </NavItem>
        {/* <Col>{location === "/collection" && <CollectionSort />}</Col> */}
      </Nav>
    </div>
  );
};

export default Navigation;
