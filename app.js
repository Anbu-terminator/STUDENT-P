const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session"); // Import express-session
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files
app.use(express.static(path.join(__dirname, "public"))); // Serve files from the public directory

// Session setup
app.use(session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` for HTTPS (in production)
}));

// Set view engine
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect("mongodb+srv://anbulegend101:vlgeadmindata@vlge.8mhrh.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema and Model for Login
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    DateofBirth: String,
    email: String,
    gender: String,
    nation: String,
    fatherName: String,
    motherName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    aadhar: String,
    phone: String,
    pin: String,
    education: String,
    previous: String,
    skills: String,
    course: String,
    time: String,
    mode: String,
    fees: String,
    offer: String,
    duration: String,
});

const Student = mongoose.model("Student", studentSchema);

// Fees Schema
const feesSchema = new mongoose.Schema({
    email: String,
    DateofBirth: String,
    feesDue: Number,
    lastPaidDate: String,
});

const Fees = mongoose.model("Fees", feesSchema);

// Handle login submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Now this should work
            res.redirect('https://vlgeadmin1.onrender.com/');
        } else {
            res.send('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});

// Login page
app.get("/", (req, res) => {
    res.render("login");
});

// Handle login submission (User login)
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // This should now work without error
            return res.redirect("https://vlgeadmin1.onrender.com/");
        }

        res.send("Invalid login details!");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("An error occurred. Please try again.");
    }
});

app.post("/login1", async (req, res) => {
    const { email, DateofBirth } = req.body;

    try {
        const student = await Student.findOne({ email, DateofBirth });

        if (!student) {
            return res.send("Invalid login details!");
        }

        const feesData = await Fees.findOne({ email, DateofBirth });

        if (!feesData) {
            return res.render("profile", { student, feesData: null });
        }

        res.render("profile", { student, feesData });
    } catch (error) {
        console.error(error);
        res.send("Server error.");
    }
});

app.get("/fees", async (req, res) => {
    const { email, DateofBirth } = req.query;

    try {
        const student = await Student.findOne({ email, DateofBirth });
        if (!student) {
            return res.send("Student not found.");
        }

        const feesData = await Fees.findOne({ email, DateofBirth });
        if (!feesData) {
            return res.send("No fees data available.");
        }

        res.render("fees", { student, feesData });
    } catch (error) {
        console.error(error);
        res.send("Server error.");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
