import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";
import { filterReleases } from "../actions";
import { connect } from "react-redux";

function CollectionFilter(props) {
  const [filter, setFilter] = useState("");
  const { filterReleases } = props;

  useEffect(() => {
    filterReleases(filter);
  }, [filter, filterReleases]);

  return (
    <Input
      type="text"
      name="filter"
      id="filter"
      placeholder="Type to filter by artist, title, label or date"
      style={{ margin: "1vh 1vw" }}
      onChange={e => setFilter(e.target.value)}
    />
  );
}


function mstp(state) {
  return {
    filterBy: state.filterBy
  };
}


function mdtp(dispatch) {
  return {
    filterReleases: filter => {
      dispatch(filterReleases(filter));
    }
  };
}

export default connect(mstp, mdtp)(CollectionFilter);
