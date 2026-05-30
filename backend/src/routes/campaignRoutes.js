const express = require("express");
const router = express.Router();
const { getAll, getOne, create, update, remove } = require("../controllers/campaignController");
const auth = require("../middleware/auth");

router.get("/", auth("admin", "marketer"), getAll);
router.get("/:id", auth("admin", "marketer"), getOne);
router.post("/", auth("admin", "marketer"), create);
router.put("/:id", auth("admin", "marketer"), update);
router.delete("/:id", auth("admin"), remove);

module.exports = router;