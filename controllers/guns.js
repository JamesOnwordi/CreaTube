const express = require("express")
const router = express.Router()
const db = require("../models")
router.use(express.urlencoded({extended:false}))


router.get("/",(req,res)=>{
    res.render("projects/home")
})

// new model
router.get("/new",(req,res)=>{
    res.render("projects/new")
    
})

router.post("/new",(req,res)=>{
    // added
    console.log(req.body)
    // add new model to db
    res.redirect("/guns")
})


router.get("/update",(req,res)=>{
    res.render("projects/update")
    
})

router.post("/update",(req,res)=>{
    // added
    console.log(req.body)
    // add new model to db
    res.redirect("/updates")
})

module.exports = router