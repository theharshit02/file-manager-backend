require('dotenv').config();
const cors = require('cors')
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
