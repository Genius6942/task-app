import express from "express";
import path from "path";
import {fileURLToPath} from 'url';

const app = express();

const server = app.listen(5174, () => {
  console.log("testing");
});

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  console.log("get");
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
