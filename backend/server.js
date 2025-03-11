const { configDotenv } = require('dotenv');
configDotenv();
const express = require('express');
const cors = require('cors'); // Import cors
const http = require('http'); // Import http
const socketIo = require('socket.io'); // Import socket.io
const app = express();
const server = http.createServer(app); // Create server
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // ✅ Set your frontend origin explicitly
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
}); // Initialize socket.io with the server and setup CORS
const connectDB = require('./db/connect_db');
const userRoute = require('./routes/userRoute');
const captainRoute = require('./routes/captainRoutes');
const cookieParser = require('cookie-parser');
const mapsRoutes = require('./routes/mapsRoutes');
const socketController = require('./controllers/socketController');

connectDB();
app.use(cors({
    origin: ["http://localhost:5173", "https://uber-riding-app.onrender.com","https://uberbyroshan.vercel.app/"], // ✅ Set the allowed origins
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRoute);
app.use('/captain', captainRoute);
app.use('/maps', mapsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

//socket connection here
socketController.socketConnection(io);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
