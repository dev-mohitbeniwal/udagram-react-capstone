import React, { useState } from "react";
import axios from "axios";
import { Form, Row, Col, Container, Button } from "react-bootstrap";
import { POST_FEED_API, FEED_SIGNED_URL_API } from "../../Config";
import Header from "../../components/Header";
import Cookies from "js-cookie";

const UploadPhoto = (props) => {
  const [signedUrl, setSignedUrl] = useState("");

  const [file, setFile] = useState({
    caption: "",
    filedata: null,
    filename: "",
  });

  async function uploadFileToS3(surl) {
    var data = file.filedata;
    var config = {
      method: "put",
      url: surl,
      headers: {
        "Content-Type": "image/png",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getSignedURL(filename) {
    var config = {
      method: "get",
      url: FEED_SIGNED_URL_API + filename,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      data: null,
    };
    axios(config)
      .then(function (response) {
        console.log("Got signed URL");
        console.log(response.data.url);
        setSignedUrl(response.data.url);
        uploadFileToS3(response.data.url, file.filedata);
      })
      .catch(function (error) {
        console.log("Failed to get the signed URL");
        console.log(error);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(file);
    var data = JSON.stringify({
      caption: file.caption,
      url: file.filename,
    });

    var config = {
      method: "post",
      url: POST_FEED_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        getSignedURL(file.filename).then(() => {
          getSignedURL(file.filename);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChange = (event) => {
    console.log(event);
    if (event.nativeEvent.srcElement.id === "caption") {
      setFile({ ...file, caption: event.currentTarget.value });
    } else if (event.target.id == "formFile") {
      let reader = new FileReader();
      let uploadFile = event.target.files[0];
      reader.onloadend = () => {
        setFile({
          ...file,
          filename: uploadFile.name,
          filedata: uploadFile,
        });
      };
      reader.readAsDataURL(uploadFile);
      setFile({ ...file, filedata: reader.result });
    }
  };

  return (
    <>
      <Container fluid="md">
        <Form onSubmit={handleSubmit}>
          <Form.Control
            id="caption"
            type="text"
            placeholder="Normal text"
            value={file.caption}
            onChange={handleChange}
          />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control type="file" onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UploadPhoto;
