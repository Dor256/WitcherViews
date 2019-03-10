import express from "express";
import { Location } from "../models/location"
import { Comment } from "../models/comments"
import { checkCommentOwnership, isLoggedIn } from "../middleware/index";

const router = express.Router({mergeParams: true});

router.get("/new", isLoggedIn, (req, res) => {
    Location.findById(req.params.id, (err, location) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {location: location});
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    Location.findById(req.params.id, (err, location) => {
        if(err) {
            console.log(err);
            res.redirect("/locations");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    location.comments.push(comment);
                    location.save();
                    req.flash("success", "Success!");
                    res.redirect("/locations/" + location._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.render("/edit", {location_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/locations/" + req.params.id);
        }
    });
});

export { router };