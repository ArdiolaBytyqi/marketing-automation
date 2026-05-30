const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Campaign = sequelize.define("Campaign", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("draft", "active", "paused", "completed"),
    defaultValue: "draft",
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  tableName: "campaigns",
  timestamps: true,
});

module.exports = Campaign;