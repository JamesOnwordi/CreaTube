const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
router.use(express.urlencoded({extended:false}))


router.get("/",async(req,res)=>{
    const favorites= await db.favorite.findAll()
    console.log(favorites[2].name)
    res.render("armory/favorite",{favorites})
    // res.send(favorites)
})

router.get("/:id",(req,res)=>{

    try{
    const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
        
    axios.get(url)
    .then(response=>{
        res.render("armory/show",{armory:response.data.data})
        // res.send(response.data.data)
    })
    }catch(err){
        console.log("here")
    }
    // console.log('the currently logged in user is:', res.locals.user)
})

router.post("/:id", (req,res)=>{
    // added
    
    console.log(req.params.id)
    // add new favorite to db
    try{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
            
        axios.get(url)
        .then(async response=>{
             armory = response.data.data

             const favorites =  await db.favorite.findOrCreate({
                where:{
                    name: armory.displayIcon,
                    uuid: armory.uuid,
                    image: armory.displayIcon,
                    userId: res.locals.user.id
                }     
            })
        })
        res.redirect("/armory")
        }catch(err){
            console.log("here")
        }
})


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