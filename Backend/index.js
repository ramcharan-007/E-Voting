const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

mongoose.connect("mongodb://localhost:8000/VotingApplication")
.then( () => {
    console.log("Connected to mongodb");
 })
 .catch((err) => {
    console.log("error connecting  to mongodb");
 })

app.get("/", (req, res) => {
    res.json({success: true});
})

app.listen(port, () =>{
    console.log(`Server is running in port ${port}`)
})

const User = require("../Backend/models/User");

// endpoint to register user in the backend
app.post("/register", async(req, res) => {
    try{
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already regustered"})
        }
        
        //create a new user
        const newUser = new User({name, email, password});

        //generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //save the user to the database
        await newUser.save();

        //send the verification email to the user
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(200).json({message: "registration succesfull Please check your email for verification"})

    }catch(error){
        console.log("Error registering user", error);
        res.status(500).json({message: "error reigstering user"});
    }
})

const sendVerificationEmail = async(email, verificationToken) => {
    //create a nodemailer transporter

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"ramcharanpaddu07@gmail.com",
            pass:"aiek rpjk lgge ynfq"
        }
    })

    //compose the email message
    const mailOptions = {
        from:"Voter helpline",
        to:email,
        subject: "Email Verification",
        text:`Please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`
    }

    try{
        await transporter.sendMail(mailOptions)
    }catch(error){
        console.log("Error sending email", error)
    }
}

app.get("/verify/:token", async(req, res) => {
    try{
        const token = req.params.token;

        const user = await User.findOne({verificationToken: token});
        if(!user){
            return res.status(404).json({message:"Invalid token"})
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({message:"Email verified succesfully"})

    }catch(error){
        console.log("error getting token", error);
        res.status(500).json({message: "Email verification failed"})
    }
})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"Invalid email"})
        }
        if(user.password !== password){
            return res.status(404).json({message:"Invalid password"})
        }
        const token = jwt.sign({userId:user._id}, secretKey);;

        res.status(200).json({token})
    }catch(error){
        res.status(500).json({message: "Login failed"});
    }

})

