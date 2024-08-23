// // src/context/UserContext.js

// import axios from "axios";
// import React, { createContext, useContext, useEffect, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [votedCandidate, setVotedCandidate] = useState(
//     localStorage.getItem("votedCandidate") || null
//   );


//   const fetchUserProfile = async (token) => {
//     try {
//       const response = await axios.get('http://localhost:3000/user/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setVotedCandidate(response.data.votedCandidate);
//       console.log("votedCandidate",votedCandidate)
//       localStorage.setItem("votedCandidate", response.data.votedCandidate);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };



//   const login = async (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//     await fetchUserProfile(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("votedCandidate");
//     setToken(null);
//     setVotedCandidate(null);
//     console.log(
//       "Logged out, cleared votedCandidate:",
//       localStorage.getItem("votedCandidate")
//     ); // Debugging line
//   };

//   const isLoggedIn = !!token;

//   return (
//     <UserContext.Provider
//       value={{
//         isLoggedIn,
//         token,
//         votedCandidate,
//         setVotedCandidate,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);












import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [votedCandidate, setVotedCandidate] = useState(
    localStorage.getItem("votedCandidate") !== null ? localStorage.getItem("votedCandidate") : null
  );

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedVotedCandidate = response.data.votedCandidate;
      setVotedCandidate(fetchedVotedCandidate);
      if (fetchedVotedCandidate !== null) {
        localStorage.setItem("votedCandidate", fetchedVotedCandidate);
      } else {
        localStorage.removeItem("votedCandidate");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUserProfile(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("votedCandidate");
    setToken(null);
    setVotedCandidate(null);
    console.log(
      "Logged out, cleared votedCandidate:",
      localStorage.getItem("votedCandidate")
    ); // Debugging line
  };

  const isLoggedIn = !!token;

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        token,
        votedCandidate,
        setVotedCandidate,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
