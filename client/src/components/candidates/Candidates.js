// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './candidates.css';

// const Candidates = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [votedCandidate, setVotedCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [editingCandidate, setEditingCandidate] = useState(null);
//   const [newCandidate, setNewCandidate] = useState({ name: '', party: '', age: '' });
//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/candidate');
//         setCandidates(response.data);
//       } catch (error) {
//         console.error('Error fetching candidates', error);
//         alert('Error fetching candidates');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const checkAdmin = () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const payload = JSON.parse(atob(token.split('.')[1]));
//           const userRole = payload.role;
//           setIsAdmin(userRole === 'admin');
//         } catch (error) {
//           console.error('Error decoding token:', error);
//           setIsAdmin(false);
//         }
//       } else {
//         setIsAdmin(false);
//       }
//     };

//     fetchCandidates();
//     checkAdmin();
//   }, []);

//   const handleVote = async (candidateID) => {
//     if (votedCandidate) {
//       alert('You have already voted.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         alert('You need to be logged in to vote.');
//         return;
//       }
//       await axios.post(`http://localhost:3000/candidate/vote/${candidateID}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setVotedCandidate(candidateID);
//       alert('Vote recorded successfully');
//     } catch (error) {
//       console.error('Error recording vote', error);
//       alert('Error recording vote');
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingCandidate({ ...editingCandidate, [name]: value });
//   };

//   const handleNewCandidateChange = (e) => {
//     const { name, value } = e.target;
//     setNewCandidate({ ...newCandidate, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleEditSave = async () => {
//     const formData = new FormData();
//     formData.append('name', editingCandidate.name);
//     formData.append('party', editingCandidate.party);
//     formData.append('age', editingCandidate.age);
//     if (imageFile) {
//       formData.append('image', imageFile);
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         alert('You need to be logged in to edit a candidate.');
//         return;
//       }

//       const response = await axios.put(`http://localhost:3000/candidate/${editingCandidate._id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`, // Include the token in the request headers
//         },
//       });
//       setCandidates(candidates.map(candidate => candidate._id === editingCandidate._id ? response.data : candidate));
//       setEditingCandidate(null);
//       setImageFile(null);
//       alert('Candidate updated successfully');
//     } catch (error) {
//       console.error('Error updating candidate', error);
//       alert('Error updating candidate');
//     }
//   };

//   const handleAddCandidate = async () => {
//     const formData = new FormData();
//     formData.append('name', newCandidate.name);
//     formData.append('party', newCandidate.party);
//     formData.append('age', newCandidate.age);
//     formData.append('image', imageFile);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         alert('You need to be logged in to add a candidate.');
//         return;
//       }

//       const response = await axios.post('http://localhost:3000/candidate', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`, // Include the token in the request headers
//         },
//       });

//       setCandidates([...candidates, response.data.response]);
//       setNewCandidate({ name: '', party: '', age: '' });
//       setImageFile(null);
//       alert('Candidate added successfully');
//     } catch (error) {
//       console.error('Error adding candidate', error);
//       alert('Error adding candidate');
//     }
//   };

//   const handleDeleteCandidate = async (candidateID) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         alert('You need to be logged in to delete a candidate.');
//         return;
//       }

//       await axios.delete(`http://localhost:3000/candidate/${candidateID}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCandidates(candidates.filter(candidate => candidate._id !== candidateID));
//       alert('Candidate deleted successfully');
//     } catch (error) {
//       console.error('Error deleting candidate', error);
//       alert('Error deleting candidate');
//     }
//   };

//   if (loading) {
//     return <p>Loading candidates...</p>;
//   }

//   return (
//     <div className="main-content">
//       <div className="container mt-7">
//         <h2 className="mb-5">Candidates List</h2>
//         {isAdmin && (
//           <div className="add-candidate-form">
//             <h3>Add New Candidate</h3>
//             <input type="text" name="name" placeholder="Name" value={newCandidate.name} onChange={handleNewCandidateChange} />
//             <input type="text" name="party" placeholder="Party" value={newCandidate.party} onChange={handleNewCandidateChange} />
//             <input type="number" name="age" placeholder="Age" value={newCandidate.age} onChange={handleNewCandidateChange} />
//             <input type="file" name="image" onChange={handleImageChange} />
//             <button onClick={handleAddCandidate}>Add Candidate</button>
//           </div>
//         )}
//         <div className="row">
//           <div className="col">
//             <div className="card shadow">
//               <div className="card-header border-0">
//                 <h3 className="mb-0">Candidates</h3>
//               </div>
//               <div className="table-responsive">
//                 <table className="table align-items-center table-flush">
//                   <thead className="thead-light">
//                     <tr>
//                       <th scope="col">Image</th>
//                       <th scope="col">Name</th>
//                       <th scope="col">Party</th>
//                       <th scope="col">Age</th>
//                       <th scope="col">Action</th>
//                       {isAdmin && <th scope="col">Admin Actions</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map(candidate => (
//                       <tr key={candidate._id}>
//                         <td>
//                           <img alt="Candidate" src={`http://localhost:3000/uploads/${candidate.image}`} className="avatar rounded-circle mr-3" />
//                         </td>
//                         <td>{candidate.name}</td>
//                         <td>{candidate.party}</td>
//                         <td>{candidate.age}</td>
//                         <td>
//                           <button onClick={() => handleVote(candidate._id)} disabled={votedCandidate !== null}>
//                             {votedCandidate === candidate._id ? 'Voted' : 'Vote'}
//                           </button>
//                         </td>
//                         {isAdmin && (
//                           <td>
//                             <button onClick={() => setEditingCandidate(candidate)}>Edit</button>
//                             <button onClick={() => handleDeleteCandidate(candidate._id)}>Delete</button>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//         {editingCandidate && (
//           <div className="edit-candidate-form">
//             <h3>Edit Candidate</h3>
//             <input type="text" name="name" placeholder="Name" value={editingCandidate.name} onChange={handleEditChange} />
//             <input type="text" name="party" placeholder="Party" value={editingCandidate.party} onChange={handleEditChange} />
//             <input type="number" name="age" placeholder="Age" value={editingCandidate.age} onChange={handleEditChange} />
//             <input type="file" name="image" onChange={handleImageChange} />
//             <button onClick={handleEditSave}>Save</button>
//             <button onClick={() => setEditingCandidate(null)}>Cancel</button>
//           </div>
//         )}
//       </div>
//       <footer className="footer">
//         <div className="row align-items-center justify-content-xl-between">
//           <div className="col-xl-6 m-auto text-center">
//             <div className="copyright">
//               <p>Made with <a href="https://www.creative-tim.com/product/argon-dashboard" target="_blank" rel="noopener noreferrer">Argon Dashboard</a> by Waleed Mehmood</p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Candidates;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./candidates.css";
// import { useUser } from "../../context/UserContext";

// const Candidates = () => {
//   const [candidates, setCandidates] = useState([]);
//   const {votedCandidate, setVotedCandidate} = useUser();
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [editingCandidate, setEditingCandidate] = useState(null);
//   const [newCandidate, setNewCandidate] = useState({
//     name: "",
//     party: "",
//     age: "",
//   });

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/candidate");
//         setCandidates(response.data);
//       } catch (error) {
//         console.error("Error fetching candidates", error);
//         alert("Error fetching candidates");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const checkAdmin = () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));
//           const userRole = payload.role;
//           setIsAdmin(userRole === "admin");
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           setIsAdmin(false);
//         }
//       } else {
//         setIsAdmin(false);
//       }
//     };

//     fetchCandidates();
//     checkAdmin();
//   }, []);

//   const handleVote = async (candidateID) => {
//     if (votedCandidate) {
//       alert("You have already voted.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to vote.");
//         return;
//       }
//       await axios.post(
//         `http://localhost:3000/candidate/vote/${candidateID}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setVotedCandidate(candidateID);
//       localStorage.setItem("votedCandidate", candidateID);
//       alert("Vote recorded successfully");
//     } catch (error) {
//       console.error("Error recording vote", error);
//       alert("Error recording vote");
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingCandidate({ ...editingCandidate, [name]: value });
//   };

//   const handleNewCandidateChange = (e) => {
//     const { name, value } = e.target;
//     setNewCandidate({ ...newCandidate, [name]: value });
//   };

//   const handleEditSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to edit a candidate.");
//         return;
//       }

//       const response = await axios.put(
//         `http://localhost:3000/candidate/${editingCandidate._id}`,
//         editingCandidate,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setCandidates(
//         candidates.map((candidate) =>
//           candidate._id === editingCandidate._id ? response.data : candidate
//         )
//       );
//       setEditingCandidate(null);
//       alert("Candidate updated successfully");
//     } catch (error) {
//       console.error("Error updating candidate", error);
//       alert("Error updating candidate");
//     }
//   };

//   const handleAddCandidate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to add a candidate.");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:3000/candidate",
//         newCandidate,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setCandidates([...candidates, response.data.response]);
//       setNewCandidate({ name: "", party: "", age: "" });
//       alert("Candidate added successfully");
//     } catch (error) {
//       console.error("Error adding candidate", error);
//       alert("Error adding candidate");
//     }
//   };

//   const handleDeleteCandidate = async (candidateID) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to delete a candidate.");
//         return;
//       }

//       await axios.delete(`http://localhost:3000/candidate/${candidateID}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCandidates(
//         candidates.filter((candidate) => candidate._id !== candidateID)
//       );
//       alert("Candidate deleted successfully");
//     } catch (error) {
//       console.error("Error deleting candidate", error);
//       alert("Error deleting candidate");
//     }
//   };

//   if (loading) {
//     return <p>Loading candidates...</p>;
//   }

//   return (
//     <div className="main-content">
//       <div className="container mt-7">
//         <h2 className="mb-5">Candidates List</h2>
//         {isAdmin && (
//           <div className="add-candidate-form">
//             <h3>Add New Candidate</h3>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={newCandidate.name}
//               onChange={handleNewCandidateChange}
//             />
//             <input
//               type="text"
//               name="party"
//               placeholder="Party"
//               value={newCandidate.party}
//               onChange={handleNewCandidateChange}
//             />
//             <input
//               type="number"
//               name="age"
//               placeholder="Age"
//               value={newCandidate.age}
//               onChange={handleNewCandidateChange}
//             />
//             <button onClick={handleAddCandidate}>Add Candidate</button>
//           </div>
//         )}
//         <div className="row">
//           <div className="col">
//             <div className="card shadow">
//               <div className="card-header border-0">
//                 <h3 className="mb-0">Candidates</h3>
//               </div>
//               <div className="table-responsive">
//                 <table className="table align-items-center table-flush">
//                   <thead className="thead-light">
//                     <tr>
//                       <th scope="col">Name</th>
//                       <th scope="col">Party</th>
//                       <th scope="col">Age</th>
//                       {!isAdmin && <th scope="col">Action</th>}
//                       {isAdmin && <th scope="col">Admin Actions</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((candidate) => (
//                       <tr key={candidate._id}>
//                         <td>{candidate.name}</td>
//                         <td>{candidate.party}</td>
//                         <td>{candidate.age}</td>
//                         {!isAdmin && (
//                           <td>
//                             <button
//                               onClick={() => handleVote(candidate._id)}
//                               disabled={votedCandidate !== null}
//                               style={{
//                                 backgroundColor:
//                                   votedCandidate === candidate._id
//                                     ? "#6c757d" // Voted button color
//                                     : "#F39849", // Regular button color
//                               }}
//                             >
//                               {votedCandidate === candidate._id
//                                 ? "Voted"
//                                 : "Vote"}
//                             </button>
//                           </td>
//                         )}
//                         {isAdmin && (
//                           <td>
//                             <button
//                               onClick={() => {
//                                 console.log(
//                                   "Editing candidate ID:",
//                                   candidate._id
//                                 ); // Debugging line
//                                 setEditingCandidate(candidate);
//                               }}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleDeleteCandidate(candidate._id)
//                               }
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//         {editingCandidate && (
//           <div className="edit-candidate-form">
//             <h3>Edit Candidate</h3>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={editingCandidate.name}
//               onChange={handleEditChange}
//             />
//             <input
//               type="text"
//               name="party"
//               placeholder="Party"
//               value={editingCandidate.party}
//               onChange={handleEditChange}
//             />
//             <input
//               type="number"
//               name="age"
//               placeholder="Age"
//               value={editingCandidate.age}
//               onChange={handleEditChange}
//             />
//             <button onClick={handleEditSave}>Save</button>
//             <button onClick={() => setEditingCandidate(null)}>Cancel</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Candidates;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./candidates.css";
// import { useUser } from "../../context/UserContext";

// const Candidates = () => {
//   const [candidates, setCandidates] = useState([]);
//   const { votedCandidate, setVotedCandidate } = useUser();
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [editingCandidate, setEditingCandidate] = useState(null);
//   const [newCandidate, setNewCandidate] = useState({
//     name: "",
//     party: "",
//     age: "",
//   });

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/candidate");
//         setCandidates(response.data);
//         setVotedCandidate(response.data.votedCandidate);
//       } catch (error) {
//         console.error("Error fetching candidates", error);
//         alert("Error fetching candidates");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const checkAdmin = () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));
//           const userRole = payload.role;
//           setIsAdmin(userRole === "admin");
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           setIsAdmin(false);
//         }
//       } else {
//         setIsAdmin(false);
//       }
//     };

//     const checkVotedCandidate = () => {
//       const storedVotedCandidate = localStorage.getItem("votedCandidate");
//       console.log("Stored votedCandidate:", storedVotedCandidate); // Debugging line
//       if (storedVotedCandidate) {
//         setVotedCandidate(storedVotedCandidate);
//       }
//     };

//     fetchCandidates();
//     checkAdmin();
//     checkVotedCandidate();
//   }, []);

//   const handleVote = async (candidateID) => {
//     if (votedCandidate) {
//       alert("You have already voted.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to vote.");
//         return;
//       }
//       await axios.post(
//         `http://localhost:3000/candidate/vote/${candidateID}`,
//         { candidateID },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setVotedCandidate(candidateID);
//       localStorage.setItem("votedCandidate", candidateID);
//       console.log("Vote recorded for candidate ID:", candidateID); // Debugging line
//       console.log(
//         "Updated votedCandidate:",
//         localStorage.getItem("votedCandidate")
//       ); // Debugging line
//       alert("Vote recorded successfully");
//     } catch (error) {
//       console.error("Error recording vote", error);
//       alert("Error recording vote");
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingCandidate({ ...editingCandidate, [name]: value });
//   };

//   const handleNewCandidateChange = (e) => {
//     const { name, value } = e.target;
//     setNewCandidate({ ...newCandidate, [name]: value });
//   };

//   const handleEditSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to edit a candidate.");
//         return;
//       }

//       const response = await axios.put(
//         `http://localhost:3000/candidate/${editingCandidate._id}`,
//         editingCandidate,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setCandidates(
//         candidates.map((candidate) =>
//           candidate._id === editingCandidate._id ? response.data : candidate
//         )
//       );
//       setEditingCandidate(null);
//       alert("Candidate updated successfully");
//     } catch (error) {
//       console.error("Error updating candidate", error);
//       alert("Error updating candidate");
//     }
//   };

//   const handleAddCandidate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to add a candidate.");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:3000/candidate",
//         newCandidate,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setCandidates([...candidates, response.data.response]);
//       setNewCandidate({ name: "", party: "", age: "" });
//       alert("Candidate added successfully");
//     } catch (error) {
//       console.error("Error adding candidate", error);
//       alert("Error adding candidate");
//     }
//   };

//   const handleDeleteCandidate = async (candidateID) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You need to be logged in to delete a candidate.");
//         return;
//       }

//       await axios.delete(`http://localhost:3000/candidate/${candidateID}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCandidates(
//         candidates.filter((candidate) => candidate._id !== candidateID)
//       );
//       alert("Candidate deleted successfully");
//     } catch (error) {
//       console.error("Error deleting candidate", error);
//       alert("Error deleting candidate");
//     }
//   };

//   if (loading) {
//     return <p>Loading candidates...</p>;
//   }

//   return (
//     <div className="main-content">
//       <div className="container mt-7">
//         <h2 className="mb-5">Candidates List</h2>
//         {isAdmin && (
//           <div className="add-candidate-form">
//             <h3>Add New Candidate</h3>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={newCandidate.name}
//               onChange={handleNewCandidateChange}
//             />
//             <input
//               type="text"
//               name="party"
//               placeholder="Party"
//               value={newCandidate.party}
//               onChange={handleNewCandidateChange}
//             />
//             <input
//               type="number"
//               name="age"
//               placeholder="Age"
//               value={newCandidate.age}
//               onChange={handleNewCandidateChange}
//             />
//             <button onClick={handleAddCandidate}>Add Candidate</button>
//           </div>
//         )}
//         <div className="row">
//           <div className="col">
//             <div className="card shadow">
//               <div className="card-header border-0">
//                 <h3 className="mb-0">Candidates</h3>
//               </div>
//               <div className="table-responsive">
//                 <table className="table align-items-center table-flush">
//                   <thead className="thead-light">
//                     <tr>
//                       <th scope="col">Name</th>
//                       <th scope="col">Party</th>
//                       <th scope="col">Age</th>
//                       {!isAdmin && <th scope="col">Action</th>}
//                       {isAdmin && <th scope="col">Admin Actions</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((candidate) => (
//                       <tr key={candidate._id}>
//                         <td>{candidate.name}</td>
//                         <td>{candidate.party}</td>
//                         <td>{candidate.age}</td>
//                         {!isAdmin && (
//                           <td>
//                             <button
//                               onClick={() => handleVote(candidate._id)}
//                               disabled={votedCandidate === candidate._id}
//                               style={{
//                                 backgroundColor:
//                                   votedCandidate === candidate._id
//                                     ? "#6c757d" // Voted button color
//                                     : "#F39849", // Regular button color
//                               }}
//                             >
//                               {votedCandidate === candidate._id
//                                 ? "Voted"
//                                 : "Vote"}
//                             </button>
//                           </td>
//                         )}
//                         {isAdmin && (
//                           <td>
//                             <button
//                               onClick={() => {
//                                 console.log(
//                                   "Editing candidate ID:",
//                                   candidate._id
//                                 ); // Debugging line
//                                 setEditingCandidate(candidate);
//                               }}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleDeleteCandidate(candidate._id)
//                               }
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//         {editingCandidate && (
//           <div className="edit-candidate-form">
//             <h3>Edit Candidate</h3>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={editingCandidate.name}
//               onChange={handleEditChange}
//             />
//             <input
//               type="text"
//               name="party"
//               placeholder="Party"
//               value={editingCandidate.party}
//               onChange={handleEditChange}
//             />
//             <input
//               type="number"
//               name="age"
//               placeholder="Age"
//               value={editingCandidate.age}
//               onChange={handleEditChange}
//             />
//             <button onClick={handleEditSave}>Save</button>
//             <button onClick={() => setEditingCandidate(null)}>Cancel</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Candidates;


// Good Code for votedCandidate
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./candidates.css";
import { useUser } from "../../context/UserContext";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const { votedCandidate, setVotedCandidate } = useUser();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    age: "",
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/candidate`);
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates", error);
        alert("Error fetching candidates");
      } finally {
        setLoading(false);
      }
    };

    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userRole = payload.role;
          setIsAdmin(userRole === "admin");
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    const checkVotedCandidate = () => {
      const storedVotedCandidate = localStorage.getItem("votedCandidate");
      if (storedVotedCandidate) {
        setVotedCandidate(storedVotedCandidate);
      }
    };

    fetchCandidates();
    checkAdmin();
    checkVotedCandidate();
  }, [setVotedCandidate]);

  const handleVote = async (candidateID) => {
    if (votedCandidate) {
      alert("You have already voted.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to vote.");
        return;
      }
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/candidate/vote/${candidateID}`,
        { },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVotedCandidate(candidateID);
      console.log("candidateID",candidateID)
      localStorage.setItem("votedCandidate", candidateID);
      alert("Vote recorded successfully");
    } catch (error) {
      console.error("Error recording vote", error);
      alert("Error recording vote");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCandidate({ ...editingCandidate, [name]: value });
  };

  const handleNewCandidateChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({ ...newCandidate, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to edit a candidate.");
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/candidate/${editingCandidate._id}`,
        editingCandidate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCandidates(
        candidates.map((candidate) =>
          candidate._id === editingCandidate._id ? response.data : candidate
        )
      );
      setEditingCandidate(null);
      alert("Candidate updated successfully");
    } catch (error) {
      console.error("Error updating candidate", error);
      alert("Error updating candidate");
    }
  };

  const handleAddCandidate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to add a candidate.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/candidate`,
        newCandidate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidates([...candidates, response.data.response]);
      setNewCandidate({ name: "", party: "", age: "" });
      alert("Candidate added successfully");
    } catch (error) {
      console.error("Error adding candidate", error);
      alert("Error adding candidate");
    }
  };

  const handleDeleteCandidate = async (candidateID) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to delete a candidate.");
        return;
      }

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/candidate/${candidateID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidates(
        candidates.filter((candidate) => candidate._id !== candidateID)
      );
      alert("Candidate deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate", error);
      alert("Error deleting candidate");
    }
  };

  if (loading) {
    return <p>Loading candidates...</p>;
  }

  return (
    <div className="main-content">
      <div className="container mt-7">
        <h2 className="mb-5">Candidates List</h2>
        {isAdmin && (
          <div className="add-candidate-form">
            <h3>Add New Candidate</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newCandidate.name}
              onChange={handleNewCandidateChange}
            />
            <input
              type="text"
              name="party"
              placeholder="Party"
              value={newCandidate.party}
              onChange={handleNewCandidateChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newCandidate.age}
              onChange={handleNewCandidateChange}
            />
            <button onClick={handleAddCandidate}>Add Candidate</button>
          </div>
        )}
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <h3 className="mb-0">Candidates</h3>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Party</th>
                      <th scope="col">Age</th>
                      {!isAdmin && <th scope="col">Action</th>}
                      {isAdmin && <th scope="col">Admin Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.party}</td>
                        <td>{candidate.age}</td>
                        {!isAdmin && (
                          <td>
                            <button
                              onClick={() => handleVote(candidate._id)}
                              disabled={votedCandidate === candidate._id}
                              style={{
                                backgroundColor:
                                  votedCandidate === candidate._id
                                    ? "#6c757d" // Voted button color
                                    : "#F39849", // Regular button color
                              }}
                            >
                              {votedCandidate === candidate._id
                                ? "Voted"
                                : "Vote"}
                            </button>
                          </td>
                        )}
                        {isAdmin && (
                          <td>
                            <button
                              onClick={() => setEditingCandidate(candidate)}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCandidate(candidate._id)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {editingCandidate && (
          <div className="edit-candidate-form">
            <h3>Edit Candidate</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editingCandidate.name}
              onChange={handleEditChange}
            />
            <input
              type="text"
              name="party"
              placeholder="Party"
              value={editingCandidate.party}
              onChange={handleEditChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={editingCandidate.age}
              onChange={handleEditChange}
            />
            <button onClick={handleEditSave}>Save</button>
            <button onClick={() => setEditingCandidate(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
