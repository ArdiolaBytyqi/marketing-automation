const express = require("express");
const router = express.Router();
const { getAll, getOne, create, updateStatus, remove } = require("../controllers/leadController");
const auth = require("../middleware/auth");

router.get("/", auth("admin", "marketer"), getAll);
router.get("/:id", auth("admin", "marketer"), getOne);
router.post("/", auth("admin", "marketer"), create);
router.put("/:id/status", auth("admin", "marketer"), updateStatus);
router.delete("/:id", auth("admin"), remove);

module.exports = router;