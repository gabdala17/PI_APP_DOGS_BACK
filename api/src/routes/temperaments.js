require('dotenv').config();
const express = require('express')
const router = express.Router()


const {allTemperaments} = require('./controllers');
/* [ ] GET /temperaments:
Obtener todos los temperamentos posibles
En una primera instancia deberán obtenerlos desde la API externa y guardarlos en su propia base de datos y luego ya utilizarlos desde allí */


router.get('/', async (req,res,next)=>{
 try {
  const temperamentDogs= await allTemperaments() 
  res.json(temperamentDogs)
  
 } catch (error) {
  next(error)
 }
})





module.exports= router;