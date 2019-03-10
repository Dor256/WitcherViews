import express from "express";
import { Location } from "../models/location";
import { Comment } from "../models/comments";
import { checkLocationOwnership, isLoggedIn } from "../middleware/index";

const router = express.Router();

router.get("/", (req, res) => {
    Location.find({}, (err, allLocations) => {
        if(err) {
            console.log(err);
        } else {
            res.render("locations/index", {locations: allLocations});
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    const name = req.body.name;
    const region = req.body.region;
    const image = req.body.img;
    const desc = req.body.desc;
    const author = {id: req.user._id, username: req.user.username};
    const newLocation = {name: name, region: region, image: image, desc: desc, author: author};
    Location.create(newLocation, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/locations");
        }
    });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("locations/new");
});

router.get("/:id", (req, res) => {
    Location.findById(req.params.id).populate("comments").exec((err, foundLocation) => {
        if(err) {
            console.log(err);
        } else {
            res.render("locations/show", {location: foundLocation});
        }
    });
});

router.get("/:id/edit", checkLocationOwnership, (req, res) => {
    Location.findById(req.params.id, (err, foundLocation) => {
            if(err) {
                console.log(err);
            } else {
                res.render("locations/edit", {location: foundLocation});
            }
        });
});

router.put("/:id", checkLocationOwnership, (req, res) => {
    Location.findByIdAndUpdate(req.params.id, req.body.location, (err) => {
        if(err) {
            res.redirect("/locations");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

router.delete("/:id", checkLocationOwnership, (req, res) => {
    Location.findByIdAndRemove(req.params.id, (err, removedLocation) => {
        if(err) {
            console.log(err);
        } else {
            Comment.deleteMany({_id: {$in: removedLocation.comments}}, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/locations");
                }
            });
        }
    });
});

export { router };