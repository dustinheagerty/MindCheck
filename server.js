const express = require("express");
const cors = require("cors");
const entriesRouter = require("./routes/entries");
const summaryRouter = require("./routes/summary");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/entries", entriesRouter);
app.use("/summary", summaryRouter);

app.get("/", (req, res) => res.json({ status: "MindCheck API is running." }));

app.listen(3001, () => console.log("Running at http://localhost:3001"));
