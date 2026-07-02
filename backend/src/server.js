import express from "express";
import cors from "cors";

import "dotenv/config";
import fs from "fs";
import path from "path";

import {clerkMiddleware} from "@clerk/express"

import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkwebhook from "./webhooks/clerk.webhook.js";

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");

//it's imp that you don't parse the webhook event data,it should be in raw format
app.use("/api/webhooks/clerk",express.raw({type:"application/json"}), clerkwebhook);

app.use(express.json());
app.use(cors({origin:FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware());

app.get("/kash",(req,res)=>{
  res.status(200).json({ok:true});
});

//if the public directory exists,serve the static files
if (fs.existsSync(publicDir)){
  app.use(express.static(publicDir));

  app.get("/{*any}",(req,res,next) =>{
    res.sendFile(path.join(publicDir,"index.html"),(err)=>next(err));
  });
}

app.listen(PORT,()=>{
  connectDB();
  console.log("server isrunning on port :", PORT)

  if(process.env.NODE_ENV === "production") job.start();
});