const socket = require('socket.io');
const captainModel = require('../models/captainModel');
const { getCoordinates } = require('../services/maps');
const { rideModel } = require('../models/ridesModel');


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


const getAvailableCaptains = async (source) => {
    try {

        if (!source || !source.latitude || !source.longitude) {
            console.log("Please provide a valid source location");
        }

        // Fetch all active captains (since isAvailable is not in schema)
        const allCaptains = await captainModel.find({ status: "active" });

        console.log("Total Active Captains:", allCaptains.length, source);

        // Filter captains within 5 km radius
        const captains = allCaptains.filter((captain) => {
            if (!captain.location || captain.location.latitude == null || captain.location.longitude == null) {
                console.log("Skipping captain due to missing location:", captain.fullName);
                return false;
            }

            const distance = haversineDistance(
                source.latitude, source.longitude,
                captain.location.latitude, captain.location.longitude
            );

            console.log(`Captain ${captain.fullName.firstName}: Distance = ${distance.toFixed(2)} km`);

            return distance <= 5; // Keep only captains within 5 km
        });

        console.log("Filtered Captains:", captains.length);

        console.log({ message: "Available captains", captains });
        return captains;

    } catch (error) {
        console.error("Error fetching captains:", error);
    }
};


exports.socketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('Captain ID:', socket.id);
        socket.on('updateProfile', async (message) => {
            try {
                const captain = await captainModel.findOneAndUpdate(
                    { _id: message._id },
                    { 
                        socketId: socket.id, // Set the socketId to the captain model
                        status: 'active' // Set status to active
                    }, 
                    { new: true }
                );
                console.log("Captain profile updated successfully", captain);
            } catch (error) {
                console.log("Error updating captain profile", error);
            }
        },);


        socket.on('rideAccepted', async (rideDetails) => {
            
            try {
                const captain = await captainModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { 
                        status: 'busy' // Set status to busy
                    }, 
                    { new: true }
                );

                if (!captain) {
                    console.log("Captain not found for socket ID:", socket.id);
                    return;
                }

                const ride = await rideModel.findOneAndUpdate(
                    { _id: rideDetails.rideDetails.ride._id },
                    { 
                        captain_id: captain._id,
                        ride_status: 'accepted'
                    }, 
                    { new: true }
                );

                if (!ride) {
                    console.log("Ride not found for ID:", rideDetails.rideDetails.ride._id);
                    return;
                }

                console.log("Ride accepted successfully by captain", ride);
                console.log("Captain profile updated successfully", captain);
                
            } catch (error) {
                console.log("Error updating captain profile", error);
            }
        });


        socket.on('rideRequested', async (rideDetails) => {
            console.log('Ride requested:', rideDetails);
            let coordinate=await getCoordinates(rideDetails.ride.source)
            let location={latitude:coordinate.latitude,longitude:coordinate.longitude};
            let source=await getAvailableCaptains(location);
            console.log(location,source);
            
            // Notify the captain about the ride request
            const activeCaptains = source;
            
            if ((activeCaptains).length === 0) {
                console.log('No captains available');
                return;
            }
            activeCaptains.forEach(captain => {
                socket.to(captain.socketId).emit('rideRequested', { message: 'New ride request received', rideDetails });
            });
        });


        

        socket.on('updateLocation', async (message) => {
            try {
                const captain=await captainModel.findOneAndUpdate({socketId:socket.id},{location:message},{new:true});
                // console.log('Captain location updated successfully',captain);
                
            } catch (error) {
                console.log('Error updating captain location',error);
                
            }
        });
        socket.on('userConnected', (message) => {
            console.log('Hello User:', message);
        });









        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        socket.on('disconnect', async() => {
            console.log('Disconnected:', socket.id);
            try {
                const captain = await captainModel.findOneAndUpdate(
                    { socketId: socket.id, },
                    { 
                        status: 'inactive' // Set status to active
                    }, 
                    { new: true }
                );
                console.log("Captain profile updated successfully", captain);
            } catch (error) {
                console.log("Error updating captain profile", error);
            }
        })
    });
}