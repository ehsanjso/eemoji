const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const audioRouter = require("./routers/audio");

const app = express();
app.use(cors());

const port = process.env.PORT || "8888";
const assetsDirectoryPath = path.join(__dirname, "../assets");

app.use("/assets", express.static(assetsDirectoryPath));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(audioRouter);

const server = http.createServer(app);

//----- Socket IO -------//

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running: ${port}`);
});
