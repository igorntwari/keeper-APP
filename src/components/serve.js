require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${process.env.ATLAS_ID}:${process.env.ATLAS_PW}@cluster0.ouzmlbq.mongodb.net/keeperDB`
);

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title. No title specified."]
  },
  content: {
    type: String,
    required: [true, "Please write your content. No content specified."]
  }
});

const Note = new mongoose.model("Note", noteSchema);

app.route("/").get((req, res) => {
  res.send(
    `<h1 style='color:gold;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%)'>This is RESTful API for KeeperApp </h1>`
  );
});

app
  .route("/notes")
  .get((req, res) => {
    Note.find({}, (err, foundNotes) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(foundNotes);
      }
    });
  })
  .post((req, res) => {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    });
    newNote.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          message: "New note successfully saved to database"
        });
      }
    });
  });

app.delete("/notes/:id", (req, res) => {
  Note.deleteOne({ _id: req.params.id }, (err, respond) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json({
        message: `Successfully deleted item with id: ${req.params.id}.`,
        respond: respond
      });
    }
  });
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
