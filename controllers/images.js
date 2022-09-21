const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(methodOveride("_method"))
router.use(express.urlencoded({extended:false}))

// Route to display all weapon's skin images
router.get("/",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons/skins`

        console.log("REQ.PARAM",url)

        const response = await axios.get(url)
        // console.log(response)
        const datas= response.data.data 
        // console.log("DATAS",datas)
            let store =[]
            datas.forEach(data =>{
                data.chromas.forEach(chroma=>{  
                    // console.log("CHROMA",chroma)
                    if(chroma.displayName !== "Odin" &&chroma.displayName !== "Classic" && chroma.displayName !== "Sheriff"){
                        if(chroma.displayName !== "Ghost" &&chroma.displayName !== "Shorty" && chroma.displayName !== "Frenzy"){
                            if(chroma.displayName !== "Stinger" &&chroma.displayName !== "Spectre" && chroma.displayName !== "Bulldog"){
                                if(chroma.displayName !== "Phantom" &&chroma.displayName !== "Vandal" && chroma.displayName !== "Ares"){
                                    if(chroma.displayName !== "Guardian" &&chroma.displayName !== "Judge" && chroma.displayName !== "Bucky"){
                                        if(chroma.displayName !== "Marshal" &&chroma.displayName !== "Operator" && chroma.displayName !== "Melee" && chroma.displayName !== "Standard" && chroma.displayName !== "Standard Melee"){
                                            
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

                                        }
                                    }
                                }
                            }
                        }
                    }
                                 
                }) 
            })
            
             res.render("armory/images",{skins:store,oldId:req.query.id,image:req.query.image})
        }catch(err){
            console.log(err)
        } 
}) 

module.exports = router