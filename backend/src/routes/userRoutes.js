const express = require("express");
const router = express.Router();
const { getAll, getOne, update, remove } = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/", auth("admin"), getAll);
router.get("/:id", auth("admin"), getOne);
router.put("/:id", auth("admin"), update);
router.delete("/:id", auth("admin"), remove);

module.exports = router;