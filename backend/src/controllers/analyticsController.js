const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");
const EmailLog = require("../models/EmailLog");
const redisClient = require("../config/redis");

const getCampaignStats = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const cacheKey = `analytics:${campaignId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached), fromCache: true });
    }

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const totalLeads = await Lead.count({ where: { campaignId } });
    const convertedLeads = await Lead.count({ where: { campaignId, status: "converted" } });
    const lostLeads = await Lead.count({ where: { campaignId, status: "lost" } });
    const newLeads = await Lead.count({ where: { campaignId, status: "new" } });

    const totalEmails = await EmailLog.count({ where: { campaignId } });
    const sentEmails = await EmailLog.count({ where: { campaignId, status: "sent" } });
    const failedEmails = await EmailLog.count({ where: { campaignId, status: "failed" } });

    const data = {
      campaign: { id: campaign.id, title: campaign.title, status: campaign.status },
      leads: { total: totalLeads, converted: convertedLeads, lost: lostLeads, new: newLeads },
      emails: { total: totalEmails, sent: sentEmails, failed: failedEmails },
      conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) + "%" : "0%",
    };

    await redisClient.setEx(cacheKey, 300, JSON.stringify(data));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getOverview = async (req, res, next) => {
  try {
    const totalCampaigns = await Campaign.count();
    const activeCampaigns = await Campaign.count({ where: { status: "active" } });
    const totalLeads = await Lead.count();
    const convertedLeads = await Lead.count({ where: { status: "converted" } });
    const totalEmails = await EmailLog.count();
    const sentEmails = await EmailLog.count({ where: { status: "sent" } });

    res.json({
      success: true,
      data: {
        campaigns: { total: totalCampaigns, active: activeCampaigns },
        leads: { total: totalLeads, converted: convertedLeads },
        emails: { total: totalEmails, sent: sentEmails },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCampaignStats, getOverview };