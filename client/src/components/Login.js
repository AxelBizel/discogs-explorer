import React, { useState } from "react";
import { Row, Input, Button, Form, FormGroup, Label } from "reactstrap";
import axios from "axios";

function Login() {
  const [discogsUser, setDiscogsUser] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [submitting, setSubmitting] = useState(false);
  const signup = window.location.pathname === "/";

  const handleLogin = async () => {
    try {
      const req = await axios.post(`http://127.0.0.1:8080/api/auth/login`, {
        username: discogsUser,
        password: password,
      });
      localStorage.setItem("user", req.data.username);
      localStorage.setItem("token", req.data.accessToken);
      if (signup) {
        setTimeout(
          async () => await fetchCollection(req.data.accessToken),
          2000
        );
      } else {
        window.location.assign("/collection");
      }
    } catch (e) {
      setError(e.response.data.message);
    }
    return;
  };

  const fetchCollection = async (token) => {
    try {
      const col = await axios.post(
        `http://127.0.0.1:8080/api/fetch-collection`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("totalReleaseNumber", col.data.itemNumber);
      window.location.assign("/collection");
    } catch (e) {
      setError(e.response.data.message);
    }
    return;
  };

  const handleSignup = async () => {
    setSubmitting(true);
    try {
      await axios.post(`http://127.0.0.1:8080/api/auth/signup`, {
        username: discogsUser,
        email: email,
        password: password,
      });
      setTimeout(async () => await handleLogin(), 1000);
    } catch (e) {
      setError(e.response.data.message);
    }
    setSubmitting(false);
    return;
  };

  return (
    <div
      style={{
        background: "white",
        width: 350,
        margin: "auto",
        marginTop: "10vh",
        borderRadius: 20,
        padding: 30,
      }}
    >
      <Form>
        <FormGroup>
          <Label for="username">
            Hi ! Welcome to Discogs Explorer. Please enter your Discogs username
            and choose a password to start exploring your records collection.
          </Label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Discogs username"
            onChange={(e) => {
              setDiscogsUser(e.target.value);
              setError(null);
            }}
            style={{ marginTop: 20 }}
          />
          {signup && (
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              style={{ marginTop: 20 }}
            />
          )}
          <Input
            type="text"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            style={{ marginTop: 20 }}
          />
        </FormGroup>
      </Form>
      {error ? (
        <div style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {error}
        </div>
      ) : (
        <Row className="justify-content-center">
          <Button
            disabled={!discogsUser || !password || submitting}
            onClick={signup ? handleSignup : handleLogin}
          >
            {submitting ? "fdjhdjf" : "SUBMIT"}
          </Button>
        </Row>
      )}
      <Row
        className="justify-content-center"
        style={{ textAlign: "center", marginTop: 16, fontSize: "0.8rem" }}
      >
        {signup ? (
          <a href="/login">Already have an account ? Please login here.</a>
        ) : (
          <a href="/">
            First visit ? Please create an account by clicking here
          </a>
        )}
      </Row>
    </div>
  );
}

export default Login;
