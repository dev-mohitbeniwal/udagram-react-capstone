import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { REGISTER_API } from "../../Config";
import axios from "axios";

const Register = (props) => {
  const [cred, setCred] = useState({ email: "", password: "" });
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    var data = JSON.stringify({ email: cred.email, password: cred.password });
    var config = {
      method: "post",
      url: REGISTER_API,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        props.user.jwt = response.data.token;
        props.user.email = response.data.user.email;
        alert("Registration Successfull");
        if (props.user.jwt) {
          props.user.authorized = true;
          history.push("/");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Registration Failed");
      });
  };

  const handleChange = (event) => {
    if (event.currentTarget.type === "email") {
      const newemail = event.currentTarget.value;
      setCred({ email: newemail, password: cred.password });
    }
    if (event.currentTarget.type === "password") {
      const newpassword = event.currentTarget.value;
      setCred({ password: newpassword, email: cred.email });
    }
  };

  return (
    <>
      <Container fluid="lg">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={cred.username}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={cred.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Register;
