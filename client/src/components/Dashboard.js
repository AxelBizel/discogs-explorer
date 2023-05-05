import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import {
  getYears,
  getYearsAdded,
  getGenres,
  getStyles,
  getReleases,
} from "../actions";
import Loader from "./Loader";
import DashboardYearsRelease from "./DashboardYearsRelease";
import DashboardYearsAdded from "./DashboardYearsAdded";
import DashboardGenres from "./DashboardGenres";
import DashboardStyles from "./DashboardStyles";
import CountUp from "react-countup";
import Counter from "./Counter";

const Dashboard = (props) => {
  const { dispatch, years, yearsAdded, genres, styles } = props;
  const {collection} = props.collection
  useEffect(() => {
    dispatch(getYears());
    dispatch(getYearsAdded());
    dispatch(getGenres());
    dispatch(getStyles());
    dispatch(getReleases());
  }, [dispatch]);

  console.log("DASHBOARD COL", collection);

  return (
    <div id="Dashboard">
      <Container>
        <Row>
          <Col>
            <div className="counterContainer">
              <h3 className="centered">
                You got{" "}
                <span className="countup">
                  <Counter number={collection ? collection.length : 0} />
                </span>{" "}
                releases in your collection
              </h3>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="6" data-aos="fade-right" data-aos-duration="1000">
            {years === null ? (
              <Loader />
            ) : (
              <div className="chartContainer">
                <h4 className="titleChart">Repartition by release year</h4>
                <p>In number of releases</p>
                <DashboardYearsRelease years={years.years} />
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
                <h4 className="titleChart">Repartition by add date</h4>
                <p>In cumulative number of releases</p>
                <DashboardYearsAdded yearsAdded={yearsAdded.yearsAdded} />
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
                <h4 className="titleChart">Repartition by genres</h4>
                <p>In number of releases</p>
                <DashboardGenres genres={genres.genres} />
                <p>
                  <em>Genres underneath 3% of collection are not displayed</em>
                </p>
              </div>
            )}
          </Col>

          <Col xs="12" md="6" data-aos="fade-left" data-aos-duration="1000">
            {styles === null ? (
              <Loader />
            ) : (
              <div className="chartContainer">
                <h4 className="titleChart">Repartition by styles</h4>
                <p>In number of releases</p>
                <DashboardStyles styles={styles.styles} />
                <p>
                  <em>Styles underneath 1% of collection are not displayed</em>
                </p>
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
    years: state.years,
    yearsAdded: state.yearsAdded,
    genres: state.genres,
    styles: state.styles,
  };
}

export default connect(mstp)(Dashboard);
