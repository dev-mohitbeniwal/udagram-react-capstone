import React, { useState, useEffect } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import UploadPhoto from "./pages/uploads/UploadPhoto";
import UploadVideo from "./pages/uploads/UploadVideo";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Cookies from "js-cookie";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState({ authorized: false, jwt: "", email: "" });
  useEffect(() => {
    setUser({
      authorized: !!Cookies.get("jwt"),
      email: Cookies.get("user"),
      jwt: Cookies.get("jwt"),
    });
  }, [user.jwt]);
  return (
    <BrowserRouter>
      <Header user={user} />
      <Route exact path="/" render={(props) => <Home user={user} />} />
      <Route exact path="/photo" render={(props) => <UploadPhoto />} />
      <Route
        exact
        path="/feed/photo"
        render={(props) => <Home user={user} />}
      />
      <Route
        exact
        path="/feed/video"
        render={(props) => <Home user={user} />}
      />
      <Route
        exact
        path="/video"
        render={(props) => <UploadVideo user={user} />}
      />
      <Route exact path="/login" render={(props) => <Login user={user} />} />
      <Route
        exact
        path="/register"
        render={(props) => <Register user={user} />}
      />
    </BrowserRouter>
  );
}

export default App;
