require('dotenv').config();
const express = require('express')
const  {Race, Temperament}= require('../db')
const axios = require('axios')
const {
    API_KEY
  } = process.env;


let searchDogs=async(name)=>{
     
         const getDogsAPIByName = await axios.get(`https://api.thedogapi.com/v1/breeds`);

         let filtered = getDogsAPIByName.data.filter(el=>el.name===name).map(dog => {
               return {
                   id: dog.id,
                   name: dog.name,
                   temperaments: dog.temperament.replace(/\s/g, '').split(','),
                   image: dog.image.url,
                   weightMin: dog.weight.metric.split(' - ')[0],
                   weightMax: dog.weight.metric.split(' - ')[1],
                   heightMin: dog.height.metric.split(' - ')[0],
                   heightMax: dog.height.metric.split(' - ')[1],
                   life_spanMin: dog.life_span.split(' ')[0],
                   life_spanMax: dog.life_span.split(' ')[2]
               }
           });
         //console.log('ACAAAAAAAA=====>>>>>>>',filtered)
        
         return filtered
}

let dogsId=async(id)=>{
   
  // let racePromiseApi= await axios.get(`https://api.thedogapi.com/v1/breeds/${id}/?api_key=${API_KEY}`)
  // //console.log(racePromiseApi)
  // let el=racePromiseApi.data
  const getDogsAPIById = await axios.get(`https://api.thedogapi.com/v1/breeds`);

       let detailDog = getDogsAPIById.data.filter(el=>el.id===Number(id)).map(dog => {
          return {
              id: dog.id,
              name: dog.name,
              temperaments: dog.temperament,
              image: dog.image.url,
              weightMin: dog.weight.metric.split(' - ')[0],
              weightMax: dog.weight.metric.split(' - ')[1],
              heightMin: dog.height.metric.split(' - ')[0],
              heightMax: dog.height.metric.split(' - ')[1],
              life_spanMin: dog.life_span.split(' ')[0],
              life_spanMax: dog.life_span.split(' ')[2]
          }
      });
      return detailDog[0]
}


let listDogs=async()=>{
 let racePromiseApi=await axios.get(`https://api.thedogapi.com/v1/breeds/`)

        let filtered=racePromiseApi.data
        let fil=filtered.map(el=>{
              
            return{
                id:el.id,
                name: el.name,
                temperaments: el.temperament,
                image: el.image.url,
                weightMin: String(el.weight.metric).split(' - ')[0],
                weightMax: String(el.weight.metric).split(' - ')[1],
                heightMin: String(el.height.metric).split(' - ')[0],
                heightMax: String(el.height.metric).split(' - ')[1],
                life_spanMin: String(el.life_span).split(' ')[0],
                life_spanMax: String(el.life_span).split(' ')[2]
            }
        })
       
        return (fil) 
   
}
let temperamentsFunction=async()=>{
  let racePromiseApi = await axios.get(`https://api.thedogapi.com/v1/breeds`)
              let re= await racePromiseApi.data
             //console.log(re)
              let response = re.map(el=>{
                        return  el.temperament
                        }).toString().split(',')
                        
             let  response1= response.map(el=>{
                      return el.trim()
                    })
                    //console.log("esto busco AHORA=>",response1)
              let newTemper = [...new Set(response1)]
              let newTemper1= newTemper.filter(el=>el!=="")
        
    //console.log("ME INTERESA AHORA=>",temp)
              return newTemper1
}

let allTemperaments=async ()=>{
  const newTemper=await temperamentsFunction()
  //console.log('Esto trae la response',response)
  
  // console.log("ME INTERESA AHORA=>",newTemper.length)
  let temperamentDB= await Temperament.findAll({
    include: Race
  })
  if(temperamentDB.length<1){
    for (let i = 0; i < newTemper.length; i++) {
      await Temperament.create({
        name:newTemper[i]
      })
    } 
     temperamentDB = await Temperament.findAll({
      include: Race
    })
  }
  
  return temperamentDB
}

module.exports={searchDogs, listDogs,temperamentsFunction, allTemperaments,dogsId}