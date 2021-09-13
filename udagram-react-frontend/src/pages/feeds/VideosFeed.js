import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import * as config from "../../Config";
import { Container, Row, Col } from "react-bootstrap";
import VideoApp from "./VideoPlayer";

const VideosFeed = () => {
  const [appState, setAppState] = useState({ Loading: true });
  console.log(config.GET_FEED_API);

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(config.GET_VIDEO_API).then((response) => {
      const feeds = response.data.rows;
      console.log(feeds);
      setAppState({ loading: false, Feeds: feeds });
    });
  }, [setAppState]);

  return (
    <Container className="justify-content-center">
      <h2>Video Feed</h2>
      {appState.Feeds && (
        <div>
          {appState.Feeds.map((feed) => {
            return (
              <div>
                <Row className="justify-content-md-center">
                  <Card
                    style={{ width: "30rem" }}
                    className="text-center"
                    key={feed.id}
                  >
                    <VideoApp url={feed.url} key={feed.id} />
                    <Card.Body>
                      <Card.Title>{feed.caption}</Card.Title>
                      <Card.Text>{feed.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Row>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default VideosFeed;
