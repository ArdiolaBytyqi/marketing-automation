const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const EmailLog = sequelize.define("EmailLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  leadId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("sent", "failed", "pending"),
    defaultValue: "pending",
  },
  sentAt: {
    type: DataTypes.DATE,
  },
  openedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: "email_logs",
  timestamps: true,
});

module.exports = EmailLog;