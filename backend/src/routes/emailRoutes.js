const express = require("express");
const router = express.Router();
const { sendEmail, getTemplates, createTemplate, getLogs } = require("../controllers/emailController");
const auth = require("../middleware/auth");

router.post("/send", auth("admin", "marketer"), sendEmail);
router.get("/templates", auth("admin", "marketer"), getTemplates);
router.post("/templates", auth("admin", "marketer"), createTemplate);
router.get("/logs", auth("admin", "marketer"), getLogs);

module.exports = router;