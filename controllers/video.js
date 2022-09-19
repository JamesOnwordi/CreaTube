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
                skin.chromas.forEach( chroma=>{  
                    // console.log("CHROMA",chroma)
                    console.log("waiting")
                    const reactions =  db.reaction.findAll({
                        where:{
                            uuid:chroma.uuid
                        }
                    })
                    
                    let liked =0
                    let disliked =0
                    if(reactions.data){
                    reactions.data.forEach( reaction=>{

                        let liked =liked ++
                        let disliked =dislike ++
                    })
                    }
                    
                    console.log("HEREREFR")
                         if(chroma.streamedVideo){  
                            console.log("inside")
                            store.push({ 
                                name:chroma.displayName,
                                video:chroma.streamedVideo,
                                uuid:chroma.uuid,
                                like:liked,
                                dislike:disliked                 
                            })   
                        }
                    })
                }) 
            })
            console.log("store")
            console.log(store)
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

router.post("/",async (req,res)=>{
    console.log("REQ.params",req.params)
    try{
        const reaction = await db.reaction.findOne({
            where:{
                uuid:req.query.id,
                userId:res.locals.user
            }
        })
        if(reaction){
            if(req.query.react == "like"){
                if(reaction.like){
                    if(reaction.like){
                        await db.reaction.update({
                            dislike: 0
                            },{
                            where:{
                                uuid:req.query.id,
                                userId:res.locals.user
                            }
                        })    
                }else{
                    await db.reaction.update({
                        dislike: 0,
                        like: 1
                        },{
                        where:{
                            uuid:req.query.id,
                            userId:res.locals.user
                        }
                    })
                }
            }
            else{
                if(reaction.dislike){
                    await db.reaction.update({
                        dislike: 0
                        },{
                        where:{
                            uuid:req.query.id,
                            userId:res.locals.user
                        }
                    })
                }else{
                    await db.reaction.update({
                        dislike: 1,
                        like: 0
                        },{
                        where:{
                            uuid:req.query.id,
                            userId:res.locals.user
                        }
                    })
                }
            }
        }
        }else{
            // no previous reaction
            if(req.query.react == "like"){
            await db.reaction.create({
                like:1,
                uuid:req.query.id,
                userId:res.locals.user
            })}
            else{
                await db.reaction.create({
                    dislike:1,
                    uuid:req.query.id,
                    userId:res.locals.user
                })
            }
        }

            res.redirect("/video")
    
        }catch(err){
            console.log(err)
        } 
}) 


module.exports = router