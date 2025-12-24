import express from "express";
import cors from "cors";

import productRoute from "./Dashboard/Routes";
import appRoutes from "./KariyanaApp/Routes"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/dashboard", productRoute);
app.use("/api/v1/app",appRoutes);

app.get('/',(req,res) => {
    res.send("server is running")
})

export default app;
