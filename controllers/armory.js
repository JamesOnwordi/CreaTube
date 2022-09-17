const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")




router.use(express.urlencoded({extended:false}))
router.use("favorite",require("./favorite"))

// GET Route to display all weapon
router.get("/",(req,res)=>{
    const url = "https://valorant-api.com/v1/weapons"

    axios.get(url)
    .then(response=>{

        const weapon = response.data.data

        const armories = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17"]

        for(let i = 0;i<18;i++){
           switch(weapon[i].displayName){
               case "Classic" :
                armories[0] =weapon[i]
                   break;
               case "Sheriff" :
                armories[1] =weapon[i]
                   break;
               case "Ghost" :
                armories[2] =weapon[i]
                   break;
               case "Shorty" :
                armories[3] =weapon[i]
                   break;
               case "Frenzy" :
                armories[4] =weapon[i]
                   break;
               case "Stinger" :
                armories[5] =weapon[i]
                   break;
               case "Spectre" :
                armories[6] =weapon[i]
                   break;
               case "Bulldog" :
                armories[7] =weapon[i]
                   break;
               case "Phantom" :
                armories[8] =weapon[i]
                   break;
               case "Vandal" :
                armories[9] =weapon[i]
                   break;
               case "Ares" :
                armories[10] =weapon[i]
                   break;
               case "Odin" :
                armories[11] =weapon[i]
                   break;
                case "Guardian" :
                armories[12] =weapon[i]
                   break;
               case "Judge" :
                armories[13] =weapon[i]
                   break;
               case "Bucky" :
                armories[14] =weapon[i]
                   break;
               case "Marshal" :
                armories[15] =weapon[i]
                   break;
               case "Operator" :
                armories[16] =weapon[i]
                   break;
               case "Melee" :
                armories[17] =weapon[i]
                   break;
           } 
        }

         res.render("home",{armories})
    }).catch(err=>{
        console.log(err)
    })
    // console.log('the currently logged in user is:', res.locals.user)
})

// GET Route to display a weapon
router.get("/:id",(req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
        
        axios.get(url)
         .then(response=>{
             res.render("armory/detail",{armory:response.data.data,document})
        }).catch(err=>{
            console.log(err)
         })
})

//POST Route to add a weapon to favorite
router.post("/:id", (req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`       
        axios.get(url)
        .then( async response=>{
            const armory = response.data.data
            const favorites = await db.favorite.findOrCreate({
                where:{
                    uuid: armory.uuid,
                }  
                
            })
            res.redirect("/users/favorite")
        }).catch(err=>{
            console.log(err)
         })
})

// 
// // new model
// router.get("/new",(req,res)=>{
//     res.render("armory/new")
    
// })

// router.post("/new",(req,res)=>{
//     // added
//     console.log(req.body)
//     // add new model to db
//     res.redirect("/armory")
// })


// router.get("/update",(req,res)=>{
//     res.render("armory/update")  
// })

// router.post("/update",(req,res)=>{
//     // added
//     console.log(req.body)
//     // add new model to db
//     res.redirect("/updates")
// })

module.exports = router