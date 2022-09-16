const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(methodOveride("_method"))
router.use(express.urlencoded({extended:false}))
// controllers

// Route to display all favourite weapons
router.get("/",async(req,res)=>{
    const favorites= await db.favorite.findAll()
     res.render("favorite",{favorites})
})

// Route to display details of a favourite gun
router.get("/:id",(req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
        
        axios.get(url)
        .then(response=>{
                    const data= response.data.data 
                    res.render("armory/detail",{armory:data})
            })
            .catch(err=>{
            console.log(err)
            }) 
})

router.get("/skin/:id",(req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`

        console.log(req.params.id)
        
            axios.get(url)
            .then(response=>{
                const datas= response.data.data.skins 
                console.log("here")
                let store =[]
                datas.forEach(skin =>{
                    skin.chromas.forEach(chroma=>{  
                        if(chroma.streamedVideo){
                                if(chroma.displayIcon && chroma.swatch){  
                                store.push({
                                    uuid:chroma.uuid,  
                                    displayName:chroma.displayName,             
                                    swatch:chroma.swatch,    
                                    displayIcon:chroma.displayIcon  
                                })     
                            }else if(chroma.fullRender && chroma.swatch){
                                store.push({
                                    uuid:chroma.uuid,
                                    displayName:chroma.displayName,            
                                    swatch:chroma.swatch,    
                                    displayIcon:chroma.fullRender
                                })
                                }
                        }     
                    }) 
                })
                console.log("here")
                res.render("armory/skin",{skins:store,oldId:req.params.id})
                console.log("here")
                }).catch(err=>{
                        console.log(err)
                }) 
}) 

router.put("/skin/:id",(req,res)=>{

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
          
        await db.favorite.update({
            image:value
        },{
            where:{
                uuid:req.body.oldId
            }
            
        })
        res.redirect("/favorite")
    }).catch(err=>{
        console.log(err)
    }) 
   
})


// want to update for showing video
// router.put("/skin/video",(req,res)=>{

//     const url = `https://valorant-api.com/v1/weapons/skinchromas/${req.params.id}`
    
//     axios.get(url)
//     .then(async response=>{
        
//     }).catch(err=>{
//         console.log(err)
//     }) 
   
// })

router.delete("/:id",async (req,res)=>{
    const favorite = await db.favorite.destroy({
        where:{id:req.params.id}
    })
    res.redirect("/favorite")
})



 




// // GET Route to display a favourite weapon
// router.get("/:id",(req,res)=>{
//     try{
//         const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
        
//         axios.get(url)
//          .then(response=>{
//              res.render("armory/show",{armory:response.data.data})
//         })
//     }catch(err){
//         console.log(err)
//     }
// })

// try{
//     console.log(favorites.uuid)
//     const url = `https://valorant-api.com/v1/weapons/${favorites.uuid}`
//    axios.get(url)
//    .then(async response=>{ 
//     res.render("armory/favorite",{favorites,gun:response.data.data}) 
//     })
//  }catch(err){
//     console.log(err)
// }

// Route to delete a favourite weapons


module.exports = router