// import React, { useState } from 'react';
// import axios from 'axios';
// import './signup.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from "../../context/UserContext"; // Import useUser hook

// function Signup() {
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     email: '',
//     mobile: '',
//     address: '',
//     IDCardNumber: '',
//     password: '',
//     role: '',
//   });
//   const navigate = useNavigate();
//   const { login } = useUser(); // Use login function from context

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/user/signup', formData);
//       login(response.data.token); // Call login function to set token in context
//       toast.success('Signup successful!'); // Show success toast
//       setFormData({ // Clear form fields
//         name: '',
//         age: '',
//         email: '',
//         mobile: '',
//         address: '',
//         IDCardNumber: '',
//         password: '',
//         role: '',
//       });
//       navigate("/profile");
//     } catch (error) {
//       console.error('Signup error', error);
//       if (error.response && error.response.status === 400) {
//         toast.error("An admin already exist. You cannot select the admin role again.");
//       } else {
//         console.error("ID Card Number already exist", error);
//         toast.error("The ID Card Number you entered already exist. Please use a different ID Card Number");
//       }
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit} className="signup-form">
//         <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleChange} required />
//         <input type="number" name="age" value={formData.age} placeholder="Age" onChange={handleChange} required />
//         <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
//         <input type="text" name="mobile" value={formData.mobile} placeholder="Mobile" onChange={handleChange} required />
//         <input type="text" name="address" value={formData.address} placeholder="Address" onChange={handleChange} required />
//         <input type="number" name="IDCardNumber" value={formData.IDCardNumber} placeholder="ID Card Number" onChange={handleChange} required />
//         <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required />
//         <input type="text" name="role" value={formData.role} placeholder="Role" onChange={handleChange} />
//         <button type="submit">Signup</button>
//       </form>
//       <ToastContainer /> {/* Add ToastContainer to your component */}
//     </div>
//   );
// }

// export default Signup;










import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext"; // Import useUser hook

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    IDCardNumber: '',
    password: '',
    role: 'voter', // Default role set to 'voter'
  });
  const navigate = useNavigate();
  const { login } = useUser(); // Use login function from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/signup', formData);
      login(response.data.token); // Call login function to set token in context
      toast.success('Signup successful!'); // Show success toast
      setFormData({ // Clear form fields
        name: '',
        age: '',
        email: '',
        mobile: '',
        address: '',
        IDCardNumber: '',
        password: '',
        role: 'voter', // Reset role to 'voter'
      });
      navigate("/profile");
    } catch (error) {
      console.error('Signup error', error);
      if (error.response && error.response.status === 400) {
        toast.error("An admin already exists. You cannot select the admin role again.");
      } else {
        console.error("ID Card Number already exists", error);
        toast.error("The ID Card Number you entered already exists. Please use a different ID Card Number.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleChange} required />
        <input type="number" name="age" value={formData.age} placeholder="Age" onChange={handleChange} required />
        <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
        <input type="text" name="mobile" value={formData.mobile} placeholder="Mobile" onChange={handleChange} required />
        <input type="text" name="address" value={formData.address} placeholder="Address" onChange={handleChange} required />
        <input type="number" name="IDCardNumber" value={formData.IDCardNumber} placeholder="ID Card Number" onChange={handleChange} required />
        <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required />

        <div className="role-selection">
          <label>Role:</label>
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="role"
                value="voter"
                checked={formData.role === 'voter'}
                onChange={handleChange}
                className='mr-text'
              />
              Voter
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className='mr-text'
              />
              Admin
            </label>
          </div>
        </div>

        <button type="submit">Signup</button>
      </form>
      <ToastContainer /> {/* Add ToastContainer to your component */}
    </div>
  );
}

export default Signup;
