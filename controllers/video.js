const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(methodOveride("_method"))
router.use(express.urlencoded({extended:false}))

router.get("/",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons`

        const response = await axios.get(url)
        // console.log(response)
        const datas= response.data.data 
        // console.log("DATAS",datas)

            let store =[]
            datas.forEach(data =>{
                data.skins.forEach(skin =>{
                skin.chromas.forEach(chroma=>{  
                    // console.log("CHROMA",chroma)
                         if(chroma.streamedVideo){  
                            store.push({
                                name:chroma.displayName,
                                video:chroma.streamedVideo
                            })   
                        }
                    })
                }) 
            })
            res.render("armory/video",{skins:store,})
        }catch(err){
            console.log(err)
        } 
}) 

router.get("/:id",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`

        console.log("REQ.PARAM",url)

        const response = await axios.get(url)
        // console.log(response)
        const datas= response.data.data.skins 
        // console.log("DATAS",datas)
            let store =[]
            datas.forEach(data =>{
                data.chromas.forEach(chroma=>{  
                    // console.log("CHROMA",chroma)
                         if(chroma.streamedVideo){  
                            store.push({
                                name:chroma.displayName,
                                video:chroma.streamedVideo
                            })   
                        }
                }) 
            })
            res.render("armory/video",{skins:store,})
        }catch(err){
            console.log(err)
        } 
}) 


module.exports = router