var express = require("express");
var router  = express.Router({mergeParams: true});
var Tally = require("../models/tally");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find tally by id
    console.log(req.params.id);
    Tally.findById(req.params.id, function(err, tally){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {tally: tally});
        }
    })
});

//Comments Create
router.post("/", middleware.sanitizeHtml, middleware.isLoggedIn, function(req, res){
   //lookup tally using ID
   Tally.findById(req.params.id, function(err, tally){
       if(err){
           console.log(err);
           res.redirect("/tally");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               tally.comments.push(comment);
               tally.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/tally/' + tally._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {tally_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.sanitizeHtml, middleware.checkCommentOwnership, function(req, res){
   req.body.blog.body = req.sanitize(req.body.blog.body)
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/tally/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/tally/" + req.params.id);
       }
    });
});

module.exports = router;