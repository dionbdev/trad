var Tally = require("../models/tally");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkTallyOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Tally.findById(req.params.id, function(err, foundTally){
           if(err){
               req.flash("error", "Tally not found");
               res.redirect("back");
           }  else {
               // does user own the Tally?
            if(foundTally.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

// middlewareObj.cleanHtml = function(req, res, next){
//     Object.keys(req.body).forEach(function(key){
//         req.body[key] = req.sanitize(req.body[key]);
//     });
// }

// middlewareObj.sanitizeHtml = function(req,res,next) {
//     for(var key in req.body) {
//         if(req.body[key]) {
//             req.body[key] = req.sanitize(req.body[key]);
//         }
//     }
//     return next(); 
// };



module.exports = middlewareObj;