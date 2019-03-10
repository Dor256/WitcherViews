import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import LocalStrategy from "passport-local";
import expressSession from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import { User } from "./models/user";
import { router as locationRoutes } from "./routes/locations";
import { router as commentRoutes } from "./routes/comments";
import { router as authRoutes } from "./routes/index";
import { seedDB } from "./seeds";

// seedDB();
mongoose.connect("mongodb://localhost/witcher-camp");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
    secret: "The Witcher is the best game ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(authRoutes);
app.use("/locations/:id/comments", commentRoutes);
app.use("/locations", locationRoutes);


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server up");
});