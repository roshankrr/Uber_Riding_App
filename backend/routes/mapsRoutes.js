const express =require('express');
const { getCoordinates } = require('../services/maps');
const mapsRoutes=express();
const mapsController=require('../controllers/mapsController');


mapsRoutes.get('/getcoordinates',mapsController.getLocationCoordinates);
mapsRoutes.post('/getdistance',mapsController.getDistanceapi);
mapsRoutes.post('/getfare',mapsController.getFair)

module.exports=mapsRoutes;