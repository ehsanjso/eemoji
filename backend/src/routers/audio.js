const express = require("express");
const router = new express.Router();
const multer = require("multer"); //use multer to upload blob data
const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require("fs"); //use the file system so we can save files
const { spawn } = require("child_process");

router.post("/audio", upload.single("audio_data"), (req, res) => {
  let uploadLocation =
    "/Users/ehsanjso/Desktop/Waterloo/Third term/eemoji/backend/" +
    "uploads/" +
    req.file.originalname +
    ".wav"; // where to save the file to. make sure the incoming name has a .wav extension

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  ); // write the blob to the server as a file

  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python3", [
    "src/python/script.py",
    req.file.originalname,
  ]);
  // collect data from script
  python.stdout.on("data", function (data) {
    dataToSend = data.toString();
    res.status(200).send(dataToSend); //send back that everything went ok
  });

  python.stderr.on("data", function (data) {
    // console.log(`Error: ${data.toString()}`);
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    // console.log(`child process close all stdio with code ${code}`);
  });
  // send data to browser
});

module.exports = router;
