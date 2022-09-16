const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const methodOveride = require("method-override")
router.use(methodOveride("_method"))


router.use(express.urlencoded({extended:false}))
router.use("favorite",require("./favorite"))

// GET Route to display all weapon
router.get("/",(req,res)=>{
    const url = "https://valorant-api.com/v1/weapons"

    axios.get(url)
    .then(response=>{
        // console.log(response)
        res.render("home",{armories:response.data.data})
    })
    // console.log('the currently logged in user is:', res.locals.user)
})

// GET Route to display a weapon
router.get("/:id",(req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`
        
        axios.get(url)
         .then(response=>{
             res.render("armory/detail",{armory:response.data.data})
        }).catch(err=>{
            console.log(err)
         })
})

//POST Route to add a weapon to favorite
router.post("/:id", (req,res)=>{
        const url = `https://valorant-api.com/v1/weapons/${req.params.id}`       
        axios.get(url)
        .then( async response=>{
            const armory = response.data.data
            const favorites = await db.favorite.findOrCreate({
                where:{
                    name: armory.displayIcon,
                    uuid: armory.uuid,
                    image: armory.displayIcon,
                    userId: res.locals.user.id
                }  
                
            })
            res.redirect("/users/favorite")
        }).catch(err=>{
            console.log(err)
         })
})

// 
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