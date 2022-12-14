const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(methodOveride("_method"))
router.use(express.urlencoded({extended:false}))

// Route to display all weapon's skin videos
router.get("/",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons`

        const response = await axios.get(url)
        const reactions =  await db.reaction.findAll()

        const datas= response.data.data 

            let store =[]
            datas.forEach( data =>{
                data.skins.forEach(skin =>{
                skin.chromas.forEach( chroma=>{  

                    let liked =0
                    let disliked =0

                    reactions.forEach(reaction=>{
                        if(reaction.uuid == chroma.uuid){
                            if(reaction.like){
                                liked ++
                            }
                            else if(reaction.dislike){
                                disliked ++
                            }
                        }
                    })

                         if(chroma.streamedVideo){ 
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
            res.render("armory/video",{skins:store})
        }catch(err){
            console.log(err)
        } 
}) 

// Route to display all weapon's skin videos of a specific weapon
router.get("/:id",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`

        console.log("REQ.PARAM",url)

        const response = await axios.get(url)
        const reactions =  await db.reaction.findAll()
        
        const datas= response.data.data.skins 
        
            let store =[]
            datas.forEach(data =>{
                data.chromas.forEach( chroma=>{  

                    let liked =0
                    let disliked =0

                    reactions.forEach(reaction=>{
                        if(reaction.uuid == chroma.uuid){
                            if(reaction.like){
                                liked ++
                            }
                            else if(reaction.dislike){
                                disliked ++
                            }
                        }
                    })

                         if(chroma.streamedVideo){ 
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
            res.render("armory/specificVideo",{skins:store,main:req.params.id})
        }catch(err){
            console.log(err)
        } 
}) 

// Route to add reaction to weapon's skin videos of all videos
router.post("/",async (req,res)=>{
    try{
        const reaction = await db.reaction.findOne({
            where:{
                uuid:req.query.id,
                userId:res.locals.user.id
            }
        })
        if(reaction){
            if(req.query.react == "like"){
                // if(reaction.like){
                    if(reaction.like){
                        await db.reaction.update({
                            like: 0
                            },{
                            where:{
                                uuid:req.query.id,
                                userId:res.locals.user.id
                            }
                        })    
                }else{
                    await db.reaction.update({
                        dislike: 0,
                        like: 1
                        },{
                        where:{
                            uuid:req.query.id,
                            userId:res.locals.user.id
                        }
                    })
                }
             }else{
                if(reaction.dislike){
                    await db.reaction.update({
                        dislike: 0
                        },{
                        where:{
                            uuid:req.query.id,
                            userId:res.locals.user.id
                        }
                    })
                }else{
                    await db.reaction.update({
                        dislike: 1,
                        like: 0
                        },{
                        where:{
                            uuid:req.query.id,
                            userId:res.locals.user.id
                        }
                    })
                }
            }
        }else{
            // no previous reaction
            if(req.query.react == "like"){
            await db.reaction.create({
                like:1,
                uuid:req.query.id,
                userId:res.locals.user.id
            })}
            else{
                await db.reaction.create({
                    dislike:1,
                    uuid:req.query.id,
                    userId:res.locals.user.id
                })
            }
        }

            res.redirect("/users/video")
    
        }catch(err){
            console.log(err)
        } 
}) 

// Route to add like to weapon's skin videos of a specific videos
router.post("/:id",async (req,res)=>{
    try{
        const reaction = await db.reaction.findOne({
            where:{
                uuid:req.query.newId,
                userId:res.locals.user.id
            }
        })
        if(reaction){
            if(req.query.react == "like"){
                // if(reaction.like){
                    if(reaction.like){
                        await db.reaction.update({
                            like: 0
                            },{
                            where:{
                                uuid:req.query.newId,
                                userId:res.locals.user.id
                            }
                        })    
                }else{
                    await db.reaction.update({
                        dislike: 0,
                        like: 1
                        },{
                        where:{
                            uuid:req.query.newId,
                            userId:res.locals.user.id
                        }
                    })
                }
             }else{
                if(reaction.dislike){
                    await db.reaction.update({
                        dislike: 0
                        },{
                        where:{
                            uuid:req.query.newId,
                            userId:res.locals.user.id
                        }
                    })
                }else{
                    await db.reaction.update({
                        dislike: 1,
                        like: 0
                        },{
                        where:{
                            uuid:req.query.newId,
                            userId:res.locals.user.id
                        }
                    })
                }
            }
        }else{
            // no previous reaction
            if(req.query.react == "like"){
            await db.reaction.create({
                like:1,
                uuid:req.query.newId,
                userId:res.locals.user.id
            })}
            else{
                await db.reaction.create({
                    dislike:1,
                    uuid:req.query.newId,
                    userId:res.locals.user.id
                })
            }
        }

            res.redirect(`/users/favorite/video/${req.query.oldId}`)
    
        }catch(err){
            console.log(err)
        } 
}) 

module.exports = router