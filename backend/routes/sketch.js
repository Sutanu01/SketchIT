const express = require('express')
const router = express.Router();
const fetchUser = require("../middleware/FetchUser")

const Sketch = require("../models/Sketch") 
//Sketch Schema



// 1.this endpoint will fetch all the previou sketchs of the user from the database 
//user needes to be logged in
router.get('/getsketchs', fetchUser, async (req, res) => {
    try {
        const sketch = await Sketch.find({ user: req.user.id }) 
        //return all sketchs of the user with id as array
        res.json(sketch);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

//2. Add sketchs for a particular User (Login required)
router.post("/addsketch", fetchUser,async (req, res) => {
    try {
        const { title, description, img } = req.body

        const sketch = new Sketch({
            title, description, img, user: req.user.id
        })
        const saveSketch = await sketch.save(); // save() bypassses SCHEMA validation but create() doesn't though they do almost the same work
        res.json(saveSketch);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }

})
//3.delete sketch
router.delete("/deletesketch/:id", fetchUser, async (req, res) => {
    try {
        let existingSketch = await Sketch.findById(req.params.id)
        if (!existingSketch) { //exist hi nhi karegi to hawa delete karega kya?
            return res.status(400).json({ error: "Sketch not found" }) 
        }
        if (req.user.id !== existingSketch.user.toString()) //idk if toString() was needed 
            res.status(401).json({ error: "Access denied" })
        existingSketch = await Sketch.findByIdAndDelete(req.params.id)
        res.json({ "Succes": "Sketch deleted", sketch: existingSketch })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})
module.exports = router
