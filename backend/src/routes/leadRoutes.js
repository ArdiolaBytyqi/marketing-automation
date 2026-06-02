const express = require("express");
const router = express.Router();
const { getAll, getOne, create, updateStatus, remove } = require("../controllers/leadController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const schemas = require("../validation/leadSchemas");

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: List of leads
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth("admin", "marketer"), getAll);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get a single lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead data
 *       404:
 *         description: Lead not found
 */
router.get("/:id", auth("admin", "marketer"), getOne);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, campaignId]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               campaignId:
 *                 type: string
 *                 format: uuid
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead created
 *       400:
 *         description: Validation error
 */
router.post("/", auth("admin", "marketer"), validate(schemas.create), create);

/**
 * @swagger
 * /leads/{id}/status:
 *   put:
 *     summary: Update lead status
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, contacted, qualified, converted, lost]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead status updated
 *       404:
 *         description: Lead not found
 */
router.put("/:id/status", auth("admin", "marketer"), validate(schemas.updateStatus), updateStatus);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead deleted
 *       404:
 *         description: Lead not found
 */
router.delete("/:id", auth("admin"), remove);

module.exports = router;