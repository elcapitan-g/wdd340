const express = require("express");
const path = require("path");  
const app = express();

const inventoryRoutes = require("./routes/inventoryRoutes");
const baseController = require("./controllers/baseController");

app.set("view engine", "ejs");
app.set("views", "./views");  

app.use(express.static(path.join(__dirname, "public")));  

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());  


app.use("/inventory", inventoryRoutes);  


app.get("/", baseController.buildHome);  


app.use(baseController.errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
