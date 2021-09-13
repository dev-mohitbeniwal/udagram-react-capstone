import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import * as config from "../../Config";
import { Container, Row, Col } from "react-bootstrap";

const PhotosFeed = () => {
  const [appState, setAppState] = useState({ Loading: true });
  console.log(config.GET_FEED_API);

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(config.GET_FEED_API).then((response) => {
      const feeds = response.data.rows;
      console.log(feeds);
      setAppState({ loading: false, Feeds: feeds });
    });
  }, [setAppState]);

  return (
    <Container className="justify-content-center">
      {appState.Feeds && (
        <div>
          {appState.Feeds.map((feed) => {
            return (
              <div>
                <Row className="justify-content-md-center">
                  <Col xs lg="2"></Col>{" "}
                  <Col xs lg="2">
                    <Card
                      style={{ width: "25rem" }}
                      className="text-center"
                      key={feed.id}
                    >
                      <Card.Img variant="top" src={feed.url} key={feed.id} />
                      <Card.Body>
                        <Card.Title>{feed.caption}</Card.Title>
                        <Card.Text>{feed.description}</Card.Text>
                      </Card.Body>
                    </Card>
                    <br />
                  </Col>{" "}
                  <Col xs lg="2"></Col>
                </Row>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default PhotosFeed;
