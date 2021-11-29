const express = require("express");
const router = new express.Router();
const multer = require("multer"); //use multer to upload blob data
const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require("fs"); //use the file system so we can save files

router.post("/audio", upload.single("audio_data"), (req, res) => {
  let uploadLocation =
    "/Users/ehsanjso/Desktop/Waterloo/Third term/eemoji/backend/" +
    "uploads/" +
    "test.wav"; // where to save the file to. make sure the incoming name has a .wav extension

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  ); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok
});

module.exports = router;
