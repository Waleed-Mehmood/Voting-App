// src/components/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const [IDCardNumber, setIDCardNumber] = useState("");

  const handleChange = (e) => {
    setIDCardNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/forgot-password`, { IDCardNumber });
      toast.success('Password reset link has been sent to your email.');
    } catch (error) {
      console.error("Forgot password error", error);
      toast.error('Error sending password reset link. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <input
          type="number"
          name="IDCardNumber"
          placeholder="Enter your ID Card Number"
          value={IDCardNumber}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
