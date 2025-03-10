const fetch = require("node-fetch"); // Ensure you have 'node-fetch' installed

module.exports.getCoordinates = async (address) => {
  try {
    console.log("Fetching coordinates for:", address);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0]; // Extract latitude & longitude
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error("Unable to get coordinates for the provided address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

module.exports.CalculateDistance = (point1, point2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = point1.latitude;
  const lon1 = point1.longitude;
  const lat2 = point2.latitude;
  const lon2 = point2.longitude;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};


module.exports.Getfair = async (distance) => {
    const fairs = {
        bike: 8,
        auto: 10,
        car: 15
    };

    return {
        bike: distance * fairs.bike,
        auto: distance * fairs.auto,
        car: distance * fairs.car
    };
}

