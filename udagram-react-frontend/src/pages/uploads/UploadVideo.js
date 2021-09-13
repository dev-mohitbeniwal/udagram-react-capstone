import React, { useState } from "react";
import axios from "axios";
import { Form, Container, Button } from "react-bootstrap";
import { POST_VIDEO_API, VIDEO_SIGNED_URL_API } from "../../Config";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";

const UploadVideo = (props) => {
  const [file, setFile] = useState({
    caption: "",
    description: "",
    filedata: null,
    filename: "",
    fileType: "",
  });

  const history = useHistory();
  if (!Cookies.get("jwt")) {
    return <Redirect to="/login" />;
  }

  async function uploadFileToS3(surl) {
    var data = file.filedata;
    var config = {
      method: "put",
      url: surl,
      headers: {
        "Content-Type": file.fileType,
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
      url: VIDEO_SIGNED_URL_API + filename,
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
      description: file.description,
    });

    var config = {
      method: "post",
      url: POST_VIDEO_API,
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
          alert("Your video upload is in progress... Check Video feeds soon.");
          history.push("/");
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
    } else if (event.nativeEvent.srcElement.id === "description") {
      setFile({ ...file, description: event.currentTarget.value });
    } else if (event.target.id === "formFile") {
      let reader = new FileReader();
      let uploadFile = event.target.files[0];
      reader.onloadend = () => {
        setFile({
          ...file,
          filename: uploadFile.name,
          filedata: uploadFile,
          fileType: uploadFile.type,
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
            placeholder="Write some nice heading."
            value={file.caption}
            onChange={handleChange}
          />
          <Form.Control
            as="textarea"
            rows={3}
            id="description"
            placeholder="What this video is about?"
            value={file.description}
            onChange={handleChange}
          />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              onChange={handleChange}
              accept="video/mp4, video/3gp"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UploadVideo;
