import React, { useState, useEffect } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { sortReleases } from "../actions";
import { connect } from "react-redux";

const CollectionSort = props => {
  const [dropdownOpen, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Artist (asc)");
  const toggle = () => setOpen(!dropdownOpen);
  const { sortReleases } = props;

  useEffect(() => {
    sortReleases(sortBy);
  }, [sortBy, sortReleases]);

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} style={{ margin: "1vh 1vw" }}>
      <DropdownToggle caret>Sort by {sortBy}</DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => setSortBy("Artist (asc)")}>
          Artist (asc)
        </DropdownItem>
        <DropdownItem onClick={() => setSortBy("Artist (desc)")}>
          Artist (desc)
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => setSortBy("Title (asc)")}>
          Title (asc)
        </DropdownItem>
        <DropdownItem onClick={() => setSortBy("Title (desc)")}>
          Title (desc)
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => setSortBy("Year (asc)")}>
          Year (asc)
        </DropdownItem>
        <DropdownItem onClick={() => setSortBy("Year (desc)")}>
          Year (desc)
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

function mdtp(dispatch) {
  return {
    sortReleases: sortBy => {
      dispatch(sortReleases(sortBy));
    }
  };
}

export default connect(null, mdtp)(CollectionSort);
