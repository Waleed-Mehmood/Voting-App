// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Import useUser hook
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({
    IDCardNumber: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useUser(); // Use login function from context

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, formData);
      login(response.data.token); // Call login function to set token in context
      toast.success('Login successful!'); // Show success toast
      navigate("/profile");
    } catch (error) {
      console.error("Login error", error);
      toast.error('Login failed. Please check your ID Card Number and Password.'); // Show error toast
    }
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="number"
          name="IDCardNumber"
          placeholder="ID Card Number"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {/* <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link> */}
      <ToastContainer />
    </div>
  );
}

export default Login;
