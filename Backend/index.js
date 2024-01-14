const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const express = require('express');

const app = express();
const port = 3000;


const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://admin_ram:Ramcharan@cluster0.2ikjhiz.mongodb.net/")
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