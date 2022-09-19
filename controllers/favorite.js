const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")

router.use(methodOveride("_method"))
router.use(express.urlencoded({extended:false}))
// controllers
router.use("/video",require("./video"))

// Route to display all favourite weapons
router.get("/",async(req,res)=>{
    const favoritesValue= await db.favorite.findAll({
        order: [
            ['id', 'ASC'],
        ]
    })
     res.render("favorite",{favorites:favoritesValue})
})

// Route to display details of a favourite gun
// router.get("/:id",(req,res)=>{

//     console.log("ID HERERERERE",req.query)

//     console.log("ID HERERERERE",req.query.name)
//         const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
        
//         axios.get(url)
//         .then(response=>{
//                     const data= response.data.data 
//                     res.render("armory/detail",{armory:data})
//             })
//             .catch(err=>{
//             console.log(err)
//             }) 
// })

router.get("/:skin",async (req,res)=>{
    try{
        const url = `https://valorant-api.com/v1/weapons/${req.query.id}`

        console.log("REQ.PARAM",url)

        const response = await axios.get(url)
        // console.log(response)
        const datas= response.data.data.skins 
        // console.log("DATAS",datas)
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
            // res.send(store)
             res.render("armory/skin",{skins:store,oldId:req.query.id,image:req.query.image})
        }catch(err){
            console.log(err)
        } 
}) 

router.put("/skin/:id",(req,res)=>{
    console.log(req.query)
    console.log(req.params)
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


// want to update for showing video
// router.put("/skin/video",(req,res)=>{

//     const url = `https://valorant-api.com/v1/weapons/skinchromas/${req.params.id}`
    
//     axios.get(url)
//     .then(async response=>{
        
//     }).catch(err=>{
//         console.log(err)
//     }) 
   
// })

// Route to delete a favourite weapons
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



module.exports = router