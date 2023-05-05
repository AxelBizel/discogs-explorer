import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import {
  Container,
  Row,
  Col,
  Input,
  Card,
  Button,
  CardImg,
  CardBody,
  CardText,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import logoDiscogs from "../assets/img/LogoApp.png";
import { connect } from "react-redux";
import { getReleases } from "../actions";

function Login({ collection, dispatch }) {
  const [login, setLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loggedIn && login) {
      Axios.post("http://localhost:8080/api/login", { userName: login }).then(dispatch(getReleases())
      );
    }

    console.log("loggedIn", loggedIn);
    console.log("login", login);
    console.log('col length', collection.length)
  }, [loggedIn, dispatch] );

  return (
    <>
      {loggedIn && collection? (
        <>
          <Redirect to="/collection" />
        </>
      ) : (
        <>
          <Container>
            <Row className="justify-content-center">
              <Col xs="8" md="4">
                <Card data-aos="fade-down">
                  <CardBody>
                    <CardImg
                      top
                      width="100%"
                      src={logoDiscogs}
                      alt="Discogs Logo"
                      style={{ marginBottom: "2vh" }}
                    />

                    <Form>
                      <FormGroup>
                        <Label for="username">
                          Please enter your Discogs username to start exploring
                          your collection
                        </Label>
                        <Input
                          type="text"
                          name="username"
                          id="username"
                          placeholder="your Discogs username"
                          onChange={(e) => setLogin(e.target.value)}
                        />
                      </FormGroup>
                    </Form>
                    <CardText></CardText>
                    <Row className="justify-content-center">
                      <Button onClick={() => setLoggedIn(!loggedIn)}>OK</Button>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
}
function mstp(state) {
  return {
    collection: state.collection,
  };
}


export default connect(mstp)(Login);
