require('dotenv').config();
const express = require('express')
const router = express.Router()
const  {Race, Temperament}= require('../db')
const { Op } = require("sequelize");
const axios = require('axios')
const {
    API_KEY
  } = process.env;
const {searchDogs, listDogs, dogsId} = require('./controllers');

router.get('/', async (req, res, next)=>{
    try {
        const {name}= req.query;
        let racePromiseApi 
        let racePromiseDB
       
    if(name){
        
        let nombre = name.split(' ');
         nombre = nombre.map(el=>(
            el.charAt(0).toUpperCase() + el.toLowerCase().slice(1)
            )).join(' ')
        racePromiseApi= await searchDogs(nombre)
        //console.log(racePromiseApi)
        racePromiseDB = await Race.findAll({
                include:{
                    model: Temperament,
                } ,
                where:{
                    name : {
                        [Op.like]: `%${nombre}%`
                    }
                }
        })
    }
    else{
       
        racePromiseApi = await listDogs()
        racePromiseDB = await Race.findAll({
            include:[ {
                model: Temperament,
            }]
        })
    }
        racePromiseDB= racePromiseDB.map(el=>(
            el
        ))

        let allDogs=[racePromiseApi.flat(),...racePromiseDB.flat()].flat()
        //const finallyDogs= allDogs.flat()
        if(allDogs.length===0) return res.status(404).send([{message:'No existe la raza'}])
        res.status(200).send(allDogs) 
    } catch (error) {
        next(error)
    }
})
//===================================================================================
router.get('/:idRaza',async (req,res,next)=>{
    const {idRaza}=req.params
   console.log(idRaza)
   let response
     try {
        if(typeof idRaza === 'string' && idRaza.length<8){
            response = await (dogsId(idRaza))
        }
        else{
            response= await Race.findAll({
                include: [ {
                    model: Temperament,
                }],
                where:{
                    id : idRaza
                }
        })
       }
        res.status(201).send(response)
    } catch (error) {
        next(error)  
    }
})
/**/


router.post('/',async(req,res,next)=>{
/*[ ] POST /dogs:
Recibe los datos recolectados desde el formulario controlado de la ruta de creación de raza de perro por body
Crea una raza de perro en la base de datos relacionada con sus temperamentos */
try {
    const { name, heightMax, heightMin, weightMax, weightMin, life_spanMin, life_spanMax, image, temperaments } = req.body;


    let promiseApi = await searchDogs(name);

    //convertir el nombre que se envia por parámetro en minúsculas

    let nombre = name.split(' ');
    nombre = nombre.map(el=>(
        el.charAt(0).toUpperCase() + el.toLowerCase().slice(1)
    )).join(' ')


    console.log(nombre)

    //Corroborar si ya esta creado el dog
    let promiseDB = await Race.findOne({
        attributes: ["name"],
        where: { name: nombre }
    });//{}

    
    //me valida que el cliente me envíe todos los parámetros en el JSON
    console.log(name)
    console.log(heightMax)
    console.log(heightMin)
    console.log(weightMax)
    console.log(weightMin)
    console.log(temperaments)

    if (!name || !heightMax || !heightMin || !weightMax || !weightMin || !temperaments) return res.status(404).send('Faltan datos obligatorios');

    //valido que no exista la raza en la BD
    if (promiseDB !== null || promiseApi.length>0) return res.status(404).send(`La raza ${name} ya existe`);

    const newRace = { name: nombre, temperaments, heightMax, heightMin, weightMax, weightMin, life_spanMin, life_spanMax, image }

    
    console.log('aqui temperament==>', temperaments)
    
    let getNameTemperaments = await Temperament.findAll({
       
        where: { name: temperaments },
    });
    
    const newDog = await Race.create(newRace); //Me crea el dog
   // getNameTemperaments = getNameTemperaments.map(t => t.id);
    
   console.log('aqui getNameTemperaments==>', getNameTemperaments)
   
    const createTemperament = await newDog.addTemperament(getNameTemperaments);//me agrega los temperamentos

   console.log('aqui createTemperament==>', createTemperament)
   // verifico que no ocurra un error al agregar los temperamentos
    if (!createTemperament) {
        return res.status(400).send("Ocurrió un error al agregar los temperamentos al Dog");
    }

    res.status(201).send(newDog);

} catch (error) {
    next(error);
}
})


//console.log(typeof 453-5463-6754 === 'number')



module.exports= router;
/*
[ ] 

[ ] GET /dogs/{idRaza}:
Obtener el detalle de una raza de perro en particular
Debe traer solo los datos pedidos en la ruta de detalle de raza de perro
Incluir los temperamentos asociados

 */
