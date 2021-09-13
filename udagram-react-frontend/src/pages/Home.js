import React from "react";
import PhotosFeed from "./feeds/PhotosFeed";
import VideosFeed from "./feeds/VideosFeed";
import { Route, Link, BrowserRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";

const Home = (props) => {
  return (
    <BrowserRouter>
      <Container fluid="md">
        <br />
        <Row className="justify-content-md-center">
          <h1>Latest Feeds</h1>
        </Row>
        <br />
        <Row className="justify-content-md-center">
          <Col xs lg="2">
            <Link to="/feed/photo">
              <Button variant="primary">Photos Feed</Button>
            </Link>
          </Col>
          <Col xs lg="2">
            <Link to="/feed/video">
              <Button variant="primary">Videos Feed</Button>
            </Link>
          </Col>
        </Row>
        <Route exact path="/feed/photo" component={PhotosFeed} />
        <Route exact path="/feed/video" component={VideosFeed} />
      </Container>
    </BrowserRouter>
  );
};

export default Home;
