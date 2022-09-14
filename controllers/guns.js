const express = require("express")
const router = express.Router()
const db = require("../models")


// new model
router.get("/",(req,res)=>{
    res.render("new")
})

router.post("/",(req,res)=>{
    // added
})

module.exports = router