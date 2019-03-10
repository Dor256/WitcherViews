import express from "express";
import passport from "passport";
import { User } from "../models/user";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to WitcherViews " + user.username);
            res.redirect("/locations");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/locations",
    failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged You Out");
    res.redirect("/locations");
})

export { router };