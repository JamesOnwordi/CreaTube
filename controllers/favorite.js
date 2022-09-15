const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")
router.use(methodOveride("_method"))

// controllers


router.use(express.urlencoded({extended:false}))

// Route to display all favourite weapons
router.get("/",async(req,res)=>{
    const favorites= await db.favorite.findAll()
    res.render("armory/favorite",{favorites})
})

router.get("/:id",(req,res)=>{
            const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
            
            axios.get(url)
            .then(response=>{
                     const data= response.data.data
                     console.log(data) 
                     res.render("armory/show",{armory:data})
             })   
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
router.delete("/:id",async (req,res)=>{
    const favorite = await db.favorite.destroy({
        where:{id:req.params.id}
    })
    res.redirect("/favorite")
})

module.exports = router