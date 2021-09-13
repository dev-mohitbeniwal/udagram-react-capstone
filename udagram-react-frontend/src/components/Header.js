import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Container, Button } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

const Header = (props) => {
  const [user, setUser] = useState({ authorized: false, token: "", email: "" });
  const history = useHistory();
  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const deleteCookies = () => {
    Cookies.remove("user");
    Cookies.remove("jwt");
    history.push("/login");
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Upload" id="basic-nav-dropdown">
              <NavDropdown.Item href="/photo">Photo</NavDropdown.Item>
              <NavDropdown.Item href="/video">Video</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {!user.authorized && (
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          )}
          {user.authorized && (
            <Nav>
              <Nav.Link href="/">{user.email}</Nav.Link>
              <Button onClick={deleteCookies}>Logout</Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
