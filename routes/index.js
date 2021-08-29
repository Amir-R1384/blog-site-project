const express = require("express")
const router = new express.Router()

router.get('/', (req, res) => {
    try {

        res.render(__dirname +"/../views/index")

    } catch(error) {

        console.error(error)
        res.render(__dirname + "/../views/error", {error})
        
    }
    
})

module.exports = router