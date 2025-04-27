const express = require("express");
const router = express.Router();

router.get("/connectDB", (req, res) => {
    res.json({ message: "Database Connected!" });
});

module.exports = router;
