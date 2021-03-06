const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//route to html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//route to api's
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  fs.readFile("./db/db.json", function (err, data) {
    if (err) {
      throw err;
    } else {
      let notes = JSON.parse(data);
      notes.push(newNote);
// add id to notes
      notes.forEach((item, i) => {
        item.id = i + 1;
      });

      fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
        if (err) throw err;
      });
    }
  });

  res.json(newNote);
});

//route to home page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log("i am listening");
});
//DELETE route
app.delete("/api/notes/:id", (req, res) => {
  let deleteId = req.params.id;
  fs.readFile("./db/db.json", function (err, data) {
    if (err) {
      throw err;
    } else {
      let notes = JSON.parse(data);
      notes.forEach((note) => {
        if (deleteId == note.id) {
          let currentIndex = notes.indexOf(note);
          notes.splice(currentIndex, 1);
          fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw err;
            res.json(notes);
          });
        }
      });
    }
  });
});