// const express = require('express');
// const app = express();
// const db = require('./db');
// require('dotenv').config();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// app.use(bodyParser.json());
// const PORT = process.env.PORT || 3000;

// // Enable CORS
// app.use(cors());

// // Import the router files
// const userRoutes = require('./routes/userRoutes');
// const candidateRoutes = require('./routes/candidateRoutes');

// // Use the routers
// app.use('/user', userRoutes);
// app.use('/candidate', candidateRoutes);

// let gfs;
// db.once('open', () => {
//     gfs = new mongoose.mongo.GridFSBucket(db.db, {
//         bucketName: 'uploads'
//     });
// });


// app.get('/files/:filename', async (req, res) => {
//     try {
//         const files = await gfs.find({ filename: req.params.filename }).toArray();
//         if (!files || files.length === 0) {
//             return res.status(404).json({ err: 'No files exist' });
//         }

//         gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     } catch (err) {
//         res.status(500).json({ err });
//     }
// });

// app.listen(PORT, () => {
//     console.log("listening on port 3000");
// });


const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;


// CORS configuration
const corsOptions = {
    origin: ['https://voting-app-zeta-inky.vercel.app'], // yahan apna frontend URL daalain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  };

// Enable CORS
app.use(cors(corsOptions));

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
