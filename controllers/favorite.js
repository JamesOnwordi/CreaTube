const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(methodOveride("_method"))
router.use(express.urlencoded({extended:false}))

// controllers
router.use("/video",require("./video"))
router.use("/images",require("./images"))

// Route to display all favourite weapons
router.get("/",async(req,res)=>{
    const favoritesValue= await db.favorite.findAll({
        order: [
            ['id', 'ASC'],
        ]
    })
     res.render("favorite",{favorites:favoritesValue})
})

// Route to delete a favourite weapons
router.delete("/:id",async (req,res)=>{
    const favorite = await db.favorite.destroy({
        where:{id:req.params.id}
    })
    res.redirect("/favorite")
})

// Route to display a favourite weapons set of skins
router.get("/skins",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons/${req.query.id}`

        console.log("REQ.PARAM",url)

        const response = await axios.get(url)

        const datas= response.data.data.skins

            let store =[]

            datas.forEach(data =>{
                data.chromas.forEach(chroma=>{  

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
             res.render("armory/skin",{skins:store,oldId:req.query.id,image:req.query.image})
        }catch(err){
            console.log(err)
        } 
}) 

// Route to update a favourite weapons skin
router.put("/skins/:id",(req,res)=>{
    
    const url = `https://valorant-api.com/v1/weapons/skinchromas/${req.params.id}`
    
    axios.get(url)
    .then(async response=>{
        
        const datas= response.data
        let value
        if(datas.data.displayIcon){
            value = datas.data.displayIcon
        }else{
            value = datas.data.fullRender
        }
         
        const favorites = await db.favorite.findAll()
        let carryon = true
        await favorites.forEach(favorite=>{
            if(favorite.image==value && favorite.name==datas.data.displayName){
                carryon=false
            }
            console.log(carryon)
        })
        if (carryon){
            await db.favorite.update({
                image:value,
                name:datas.data.displayName
            },{
                where:{
                    uuid:req.query.id, 
                    image:req.query.image 
                }
                
            })
        }
        res.redirect("/users/favorite")
    }).catch(err=>{
        console.log(err)
    }) 
   
})



module.exports = router