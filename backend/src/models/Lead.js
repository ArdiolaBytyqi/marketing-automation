const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(
        "new",
        "contacted",
        "qualified",
        "converted",
        "lost"
      ),
      defaultValue: "new",
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.UUID,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "leads",
    timestamps: true,
  }
);

module.exports = Lead;
