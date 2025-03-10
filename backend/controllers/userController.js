const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { rideModel } = require('../models/ridesModel');
const { getDistance, getFair } = require('./mapsController');
const captainModel = require('../models/captainModel');
const { socketConnection } = require('./socketController');

const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

exports.registerUser = async (req, res) => {
    const { email, password, fullName } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(401).json({ message: 'User already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            email,
            password: hashedPassword,
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName || ''
            }
        });

        await newUser.save();
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await comparePassword(password, user.password); // Await the comparison
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateAuthToken(user);
        res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out' });
}

exports.getUserProfile = async (req, res) => {
    res.status(200).json({ user: req.user });
}

exports.createRide = async (req, res) => {
    const { source, destination, vehicle_type } = req.body;

    if (!source || !destination || !vehicle_type || !req.user) {
        return res.status(400).json({ message: "Please provide all the details" });
    }

    try {
        const calculatedDistance = await getDistance(req, res);
        const Otp = Math.floor(100000 + Math.random() * 9000);

        const newRide = new rideModel({
            source,
            destination,
            distance: calculatedDistance.distance,
            fare: calculatedDistance.fairPrices[vehicle_type],
            vehicle_type,
            user_id: req.user._id,
            Otp: Otp,
        });

        await newRide.save();
        return res.status(201).json({ message: "Ride created successfully", ride: newRide });

    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(500).json({ message: "Error creating ride", error });
    }
};

exports.getRideData = async (req, res) => {
    const data = req.body;
    if (!data.data || !data.data.ride) { // Check if ride is provided correctly
        return res.status(400).json({ message: 'Please provide ride details' });
    }

    try {
        const rides = await rideModel.find({ _id: data.data.ride._id });
        res.status(200).json({ rides: rides, message: 'Rides fetched successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while getting rides', error });
    }
}

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

exports.getAvailableCaptains = async (req, res) => {
    try {
        const { source } = req.body;

        if (!source || !source.latitude || !source.longitude) {
            return res.status(400).json({ message: "Please provide a valid source location" });
        }

        const allCaptains = await captainModel.find({ status: "active" });

        const captains = allCaptains.filter((captain) => {
            if (!captain.location || captain.location.latitude == null || captain.location.longitude == null) {
                return false;
            }

            const distance = haversineDistance(
                source.latitude, source.longitude,
                captain.location.latitude, captain.location.longitude
            );

            return distance <= 5; // Keep only captains within 5 km
        });

        res.status(200).json({ message: "Available captains", captains });

    } catch (error) {
        console.error("Error fetching captains:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
