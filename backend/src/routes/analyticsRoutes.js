const express = require("express");
const router = express.Router();
const {
  getCampaignStats,
  getOverview,
} = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get overall analytics overview
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Analytics overview
 *       401:
 *         description: Unauthorized
 */
router.get("/overview", auth("admin", "marketer"), getOverview);

/**
 * @swagger
 * /analytics/campaigns/{campaignId}:
 *   get:
 *     summary: Get statistics for a specific campaign
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Campaign statistics
 *       404:
 *         description: Campaign not found
 */
router.get(
  "/campaigns/:campaignId",
  auth("admin", "marketer"),
  getCampaignStats
);

module.exports = router;
