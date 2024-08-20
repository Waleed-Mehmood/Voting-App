// const express = require("express");
// const router = express.Router();
// const Candidate = require("../models/candidate");
// const User = require("../models/user");
// const { jwtAuthMiddleware } = require("../jwt");
// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const crypto = require("crypto");
// const path = require("path");
// require('dotenv').config();

// // Multer GridFS Storage configuration
// const storage = new GridFsStorage({
//   url: process.env.MONGODB_URL_LOCAL,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

// const upload = multer({ storage });

// router.post('/upload', upload.single('file'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }
//     res.send('File uploaded successfully');
//   } catch (error) {
//     console.error('File upload error:', error);
//     res.status(500).send('An error occurred during file upload');
//   }
// });

// // Function to check if a user has admin role
// const checkAdminRole = async (userID) => {
//   try {
//     const user = await User.findById(userID);
//     if (!user) {
//       return false;
//     }

//     // Check if the user is the only admin
//     const adminCount = await User.countDocuments({ role: "admin" });

//     // Return true only if the user is an admin and they are the only admin
//     return adminCount === 1 && user.role === "admin";
//   } catch (err) {
//     console.error("Error checking admin role:", err);
//     return false;
//   }
// };

// // Route to add a candidate
// router.post("/", jwtAuthMiddleware, upload.single("image"), async (req, res) => {
//   try {
//     if (!(await checkAdminRole(req.user.id))) {
//       return res.status(403).json({ message: "User does not have admin role" });
//     }

//     const data = req.body;
//     if (req.file) {
//       data.image = req.file.filename;
//     } else {
//       return res.status(400).json({ message: "Image file is required" });
//     }

//     const newCandidate = new Candidate(data);
//     const response = await newCandidate.save();
//     console.log("Data saved");
//     res.status(200).json({ response });
//   } catch (err) {
//     console.error("Error adding candidate:", err.message, err.stack);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Route to update a candidate
// router.put("/:candidateID", jwtAuthMiddleware, upload.single("image"), async (req, res) => {
//   try {
//     if (!(await checkAdminRole(req.user.id))) {
//       return res.status(403).json({ message: "User does not have admin role" });
//     }

//     const candidateID = req.params.candidateID;
//     const updatedCandidateData = req.body;

//     if (req.file) {
//       updatedCandidateData.image = req.file.filename;
//     }

//     const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!response) {
//       return res.status(404).json({ error: "Candidate not found" });
//     }

//     console.log("Candidate Data updated");
//     res.status(200).json(response);
//   } catch (err) {
//     console.error("Error updating candidate:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Route to delete a candidate
// router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
//   try {
//     if (!(await checkAdminRole(req.user.id))) {
//       return res.status(403).json({ message: "User does not have admin role" });
//     }

//     const candidateID = req.params.candidateID;

//     const response = await Candidate.findByIdAndDelete(candidateID);

//     if (!response) {
//       return res.status(404).json({ error: "Candidate not found" });
//     }

//     console.log("Candidate deleted");
//     res.status(200).json({ message: "Candidate deleted" });
//   } catch (err) {
//     console.error("Error deleting candidate:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Route to vote for a candidate
// router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
//   const candidateID = req.params.candidateID;
//   const userId = req.user.id;

//   try {
//     const candidate = await Candidate.findById(candidateID);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (user.isVoted) {
//       return res.status(400).json({ message: "You have already voted" });
//     }
//     if (user.role === "admin") {
//       return res.status(403).json({ message: "Admin is not allowed to vote" });
//     }

//     candidate.votes.push({ user: userId });
//     candidate.voteCount++;
//     await candidate.save();

//     user.isVoted = true;
//     await user.save();

//     res.status(200).json({ message: "Vote recorded successfully" });
//   } catch (err) {
//     console.error("Error recording vote:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Route to get vote count
// router.get("/vote/count", async (req, res) => {
//   try {
//     const candidates = await Candidate.find().sort({ voteCount: "desc" });

//     const voteRecord = candidates.map((data) => ({
//       party: data.party,
//       count: data.voteCount,
//     }));

//     res.status(200).json(voteRecord);
//   } catch (err) {
//     console.error("Error getting vote count:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Route to get list of all candidates with only name, party, and age fields
// router.get("/", async (req, res) => {
//   try {
//     const candidates = await Candidate.find({}, "name party age -_id");

//     res.status(200).json(candidates);
//   } catch (err) {
//     console.error("Error fetching candidates:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/user");
const { jwtAuthMiddleware } = require("../jwt");
require("dotenv").config();

// Function to check if a user has admin role
const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      return false;
    }

    // Check if the user is the only admin
    const adminCount = await User.countDocuments({ role: "admin" });

    // Return true only if the user is an admin and they are the only admin
    return adminCount === 1 && user.role === "admin";
  } catch (err) {
    console.error("Error checking admin role:", err);
    return false;
  }
};

// Route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const data = req.body;

    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Data saved");
    res.status(200).json({ response });
  } catch (err) {
    console.error("Error adding candidate:", err.message, err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a candidate
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate Data updated");
    res.status(200).json(response);
  } catch (err) {
    console.error("Error updating candidate:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a candidate
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json({ message: "Candidate deleted" });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to vote for a candidate
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  const candidateID = req.params.candidateID;
  const userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin is not allowed to vote" });
    }

    // Update the user's votedCandidate field
    user.votedCandidate = candidateID;
    await user.save();

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.error("Error recording vote:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get vote count
router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: "desc" });

    const voteRecord = candidates.map((data) => ({
      party: data.party,
      count: data.voteCount,
    }));

    res.status(200).json(voteRecord);
  } catch (err) {
    console.error("Error getting vote count:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get list of all candidates with only name, party, and age fields
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find({}, "name party age _id");

    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
