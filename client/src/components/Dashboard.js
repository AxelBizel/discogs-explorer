import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import {
  getYears,
  getYearsAdded,
  getCollectionCount,
  getGenres,
  getStyles,
} from "../actions";
import Loader from "./Loader";
import DashboardYearsRelease from "./DashboardYearsRelease";
import DashboardYearsAdded from "./DashboardYearsAdded";
import DashboardGenres from "./DashboardGenres";
import DashboardStyles from "./DashboardStyles";
import Counter from "./Counter";

const Dashboard = ({
  dispatch,
  years,
  collection_count,
  yearsAdded,
  genres,
  styles,
}) => {
  useEffect(() => {
    dispatch(getYears());
    dispatch(getYearsAdded());
    dispatch(getCollectionCount());
    dispatch(getGenres());
    dispatch(getStyles());
  }, [dispatch]);

  return (
    <div id="Dashboard">
      <Container>
        <h3 className="centered" style={{ paddingTop: "2vh" }}>
          You got{" "}
          <span className="countup">
            <Counter number={collection_count} />
          </span>{" "}
          releases in your collection
        </h3>

        <Row>
          <Col xs="12" md="6" data-aos="fade-right" data-aos-duration="1000">
            {years === null ? (
              <Loader />
            ) : (
              <div className="chartContainer">
                <h4 className="titleChart">Repartition by release year</h4>
                <DashboardYearsRelease years={years} />
              </div>
            )}

            {genres === null ? (
              <Loader />
            ) : (
              <div
                className="chartContainer"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <h4 className="titleChart">Top 6 genres</h4>
                <DashboardGenres genres={genres} />
              </div>
            )}
            {yearsAdded === null ? (
              <Loader />
            ) : (
              <div
                className="chartContainer"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <h4 className="titleChart">Your collection through time</h4>
                <DashboardYearsAdded yearsAdded={yearsAdded} />
              </div>
            )}
          </Col>

          <Col xs="12" md="6" data-aos="fade-left" data-aos-duration="1000">
            {styles === null ? (
              <Loader />
            ) : (
              <div className="chartContainer">
                <h4 className="titleChart">Top 50 styles</h4>
                <DashboardStyles styles={styles} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

function mstp(state) {
  return {
    collection: state.collection,
    collection_count: state.collection_count,
    years: state.years,
    yearsAdded: state.yearsAdded,
    genres: state.genres,
    styles: state.styles,
  };
}

export default connect(mstp)(Dashboard);
