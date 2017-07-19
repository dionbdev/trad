var express = require("express");
var router  = express.Router();
var Tally = require("../models/tally");
var middleware = require("../middleware");



//INDEX - show all tally
router.get("/", function(req, res){
    // Get all tally from DB
    Tally.find({}, function(err, allTally){
       if(err){
           console.log(err);
       } else {
          res.render("tally/index",{tally:allTally});
       }
    });
});

//CREATE - add new tally to DB
router.post("/", middleware.isLoggedIn,  function(req, res){
    // get data from form and add to tally array
    var exercise = req.body.exercise;
    var weight = req.body.weight;
    var image = req.body.image;
    var desc = req.body.description;
    var health = parseInt(exercise) + parseInt(weight) ;
    var dated  = req.body.dated;
  
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTally = {exercise: exercise, weight: weight, image: image, description: desc, author:author, health: health, dated: dated}
    // Create a new tally and save to DB
    Tally.create(newTally, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to tally page
            console.log(newlyCreated);
            res.redirect("/tally");
        }
    });
});

//NEW - show form to create new tally
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("tally/new"); 
});

// SHOW - shows more info about one tally
router.get("/:id", function(req, res){
    //find the tally with provided ID
    Tally.findById(req.params.id).populate("comments").exec(function(err, foundTally){
        if(err){
            console.log(err);
        } else {
            console.log(foundTally)
            //render show template with that tally
            res.render("tally/show", {tally: foundTally});
        }
    });
});


// EDIT tally ROUTE
router.get("/:id/edit", middleware.checkTallyOwnership, function(req, res){
    Tally.findById(req.params.id, function(err, foundTally){
        res.render("tally/edit", {tally: foundTally});
    });
});

// UPDATE tally ROUTE
router.put("/:id", middleware.checkTallyOwnership, function(req, res){
    // find and update the correct tally
    Tally.findByIdAndUpdate(req.params.id, req.body.tally, function(err, updatedTally){
       if(err){
           res.redirect("/tally");
       } else {
           //redirect somewhere(show page)
           res.redirect("/tally/" + req.params.id);
       }
    });
});

// DESTROY tally ROUTE
router.delete("/:id",middleware.checkTallyOwnership, function(req, res){
   Tally.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/tally");
      } else {
          res.redirect("/tally");
      }
   });
});


module.exports = router;

