const express = require("express");
const router = express.Router();
const { getCampaignStats, getOverview } = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

router.get("/overview", auth("admin", "marketer"), getOverview);
router.get("/:campaignId", auth("admin", "marketer"), getCampaignStats);

module.exports = router;