import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Candidates from "./components/candidates/Candidates";
import VoteCount from "./components/voteCount/VoteCount";
import Navbar from "./components/navbar/Navbar";
import { UserProvider, useUser } from "./context/UserContext";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
// import ForgotPassword from "./components/forgotPassword/ForgotPassword";
// import ResetPassword from "./components/ResetPassword/ResetPassword";

const AppRoutes = () => {
  const { isLoggedIn } = useUser();

  return (
    <Routes>
      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to="/profile" /> : <Signup />}
      />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/profile" /> : <Login />}
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidates"
        element={
          <PrivateRoute>
            <Candidates />
          </PrivateRoute>
        }
      />
      <Route path="/voteCount" element={<VoteCount />} />
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/profile" /> : <Login />}
      />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset/:token" element={<ResetPassword />} /> */}
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="NavbarBelowMargin">
            <AppRoutes />
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
