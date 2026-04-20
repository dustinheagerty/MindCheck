const express = require("express");
const cors = require("cors");

const authRouter     = require("./routes/auth");
const entriesRouter  = require("./routes/entries");
const trendsRouter   = require("./routes/trends");
const promptsRouter  = require("./routes/prompts");
const settingsRouter = require("./routes/settings");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",     authRouter);
app.use("/api/entries",  entriesRouter);
app.use("/api/trends",   trendsRouter);
app.use("/api/prompts",  promptsRouter);
app.use("/api/settings", settingsRouter);

app.get("/", (req, res) => res.json({ status: "MindCheck API is running." }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
