//https://api-s1bd.onrender.com

import express from "express";
import { router as index } from "./api/index";
import { router as trip } from "./api/trip";
import { router as movie } from "./api/movie";
import { router as person } from "./api/person";
import { router as stars } from "./api/stars";
import { router as creator } from "./api/creator";
import bodyParser from "body-parser";


export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/trip", trip);

app.use("/movie", movie);
app.use("/person", person);
app.use("/stars", stars);
app.use("/creator", creator);



