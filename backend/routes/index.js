// routes/index.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const csvRoutes = require("./csvRoutes");
const stockRoutes = require("./stockRoutes");
const financialRoutes = require("./financialRoutes");

// /auth -> Google/GitHub OAuth routes
router.use("/auth", authRoutes);

// /csv -> CSV upload
router.use("/csv", csvRoutes);

// /stock -> Stock price routes
router.use("/stock", stockRoutes);

// /financial -> Financial planning routes
router.use("/financial", financialRoutes);

module.exports = router;
