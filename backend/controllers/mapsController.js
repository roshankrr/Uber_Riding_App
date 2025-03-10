const { getCoordinates, CalculateDistance, Getfair } = require('../services/maps');
exports.getLocationCoordinates = async (req, res) => {
    const { address } = req.body;
    try {
        const coordinates = await getCoordinates(address);
        res.status(200).json({ message: 'Coordinates retrieved successfully', coordinates });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coordinates', error: error.message });
    }
};


exports.getDistance=async (req,res)=>{
    const {source,destination}=req.body;
    if (!source || !destination) {
        return  "Please provide source and destination";
    }

    try {
        const sourceCoordinates=await getCoordinates(source);
        const destinationCoordinates=await getCoordinates(destination);
        const distance=CalculateDistance(sourceCoordinates,destinationCoordinates);
        const fairPrices=await Getfair(distance);
        return ({distance:distance,fairPrices:fairPrices});
    } catch (error) {
        console.log("error while getting distance",error);
        
    }
}
exports.getDistanceapi=async (req,res)=>{
    const {source,destination}=req.body;
    if (!source || !destination) {
        return  "Please provide source and destination";
    }

    try {
        const sourceCoordinates=await getCoordinates(source);
        const destinationCoordinates=await getCoordinates(destination);
        const distance=CalculateDistance(sourceCoordinates,destinationCoordinates);
        const fairPrices=await Getfair(distance);
        return res.status(200).json({distance:distance,fairPrices:fairPrices
        });
    } catch (error) {
        console.log("error while getting distance",error);
        
    }
}

exports.getFair=async(distance)=>{

    if(!distance){
        return "Please provide distance";
    }
    try {
        const fairPrices=await Getfair(distance);
        return fairPrices;
        
        
    } catch (error) {
        console.log("error while getting fair",error);
        
    }
}

