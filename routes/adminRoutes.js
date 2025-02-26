const express = require("express");
const { createAdmin, adminLogin, createClass, allocateClass, getclass, login } = require("../controllers/adminController");
const router = express.Router();

router.post("/create", createAdmin);
router.post("/adminlogin", adminLogin);
router.post('/login', login);
router.post('/createClass', createClass);
router.get('/getClass', getclass);
router.post('/allocateClass', allocateClass);

module.exports = router;
