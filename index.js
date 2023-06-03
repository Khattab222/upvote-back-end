import express from 'express';
const app = express();
import { initiatApp } from './src/utils/intiateApp.js';
import { config } from "dotenv";
config({path:'./config/dev.env'});

initiatApp(app,express)