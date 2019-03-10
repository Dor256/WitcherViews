import { Comment } from "../models/comments"
import { Location } from "../models/location"

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                req.flash("error", "Location not found!");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

function checkLocationOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Location.findById(req.params.id, (err, foundLocation) => {
            if(err) {
                req.flash("error", "Location not found!");
                res.redirect("back");
            } else {
                if (!foundLocation) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                
                if(foundLocation.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    req.flash("error", "You need to be logged in to do that!")
    res.redirect("/login");
}

export { isLoggedIn, checkCommentOwnership, checkLocationOwnership };