const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log("i am listening");
});
