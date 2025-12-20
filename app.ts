import express from "express";
import cors from "cors";

import productRoute from "./Dashboard/Routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", productRoute) 


export default app;
