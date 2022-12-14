const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(express.urlencoded({extended:false}))

// controller
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

         res.render("armory/home",{armories})

    }).catch(err=>{
        console.log(err)
    })
})

// GET Route to display a specific weapon and it's stats
router.get("/:id",(req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`

        axios.get(url)
         .then(response=>{

            const datas= response.data.data.skins 
            let store =[]
            datas.forEach(data =>{
                data.chromas.forEach(chroma=>{  
                    // console.log("CHROMA",chroma)
                        if(chroma.displayIcon){  
                            store.push({
                                uuid:chroma.uuid,  
                                displayName:chroma.displayName,             
                                swatch:chroma.swatch,    
                                displayIcon:chroma.displayIcon  
                            })     
                        }else if(chroma.fullRender){
                            store.push({
                                uuid:chroma.uuid,
                                displayName:chroma.displayName,            
                                swatch:chroma.swatch,    
                                displayIcon:chroma.fullRender
                            })
                            }
                }) 
            })

             res.render("armory/detail",{armory:response.data.data,images:store})
        }).catch(err=>{
            console.log(err)
         })
})

// POST Route to add a weapon to favorite
router.post("/:id", (req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`       
        axios.get(url)
        .then( async response=>{
            const armory = response.data.data
            console.log(res.locals.user.id)
            const favorites = await db.favorite.findOrCreate({
                where:{
                    uuid: armory.uuid,
                    name:armory.displayName,
                    image:armory.displayIcon,
                    userId:res.locals.user.id
                }

                
            })
            res.redirect("/users/favorite")
        }).catch(err=>{
            console.log(err)
         })
})

module.exports = router