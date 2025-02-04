const express = require("express");
const { createAdmin, adminLogin, createClass, allocateClass } = require("../controllers/adminController");
const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", adminLogin);
router.post('/createClass', createClass);
router.post('/allocateClass', allocateClass);

module.exports = router;
