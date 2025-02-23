// const express = require('express')
// const expressProxy = require('express-http-proxy')
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import expressProxy from "express-http-proxy";
import cors from "cors";
// import express, { Request, Response } from "express";

dotenv.config();

const app = express()


// Enable CORS for all requests
app.use(cors({
    origin: "*", // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allows common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allows specific headers
}));

// manual cor option
app.options("*",  (req: Request, res: Response, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204); // No content
});

// ✅ Middleware to handle preflight requests (important!)
// app.options("*", cors()); // Handles preflight requests for all routes



// app.use('/user', expressProxy('http://localhost:3001'))
// app.use('/billing', expressProxy('http://localhost:3002'))
// app.use('/appointment', expressProxy('http://localhost:3003'))

app.use('/user', expressProxy('http://user-service:3001'));
app.use('/billing', expressProxy('http://billing-service:3002'));
app.use('/appointment', expressProxy('http://appointment-service:3003'));


app.listen(3000, () => {
    console.log('Gateway server listening on port 3000')
})