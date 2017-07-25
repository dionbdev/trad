var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Tally       = require("./models/tally"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    expressSanitizer = require("express-sanitizer")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    tallyRoutes = require("./routes/tally"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect("mongodb://localhost/tally_test718");
// mongoose.connect("mongodb://demoDB:lamp@ds113063.mlab.com:13063/trad0719");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Please help me God with this",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.locals.moment = require("moment");
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/tally", tallyRoutes);
app.use("/tally/:id/comments", commentRoutes);



// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The Server Has Started!");
// });


app.listen(4000, function(){
   console.log("The Tally Server Has Started! 4000");
});


