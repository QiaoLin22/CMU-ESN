const { requireAuth } = require("../middleware/authmiddleware");
const router = require("express").Router();

const postIndex = require("../controllers/indexController");
const UserController = new (require("../controllers/userController"))();

router.get("/main", requireAuth, (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
});

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", postIndex);

router.post("/api/users", UserController.createUser);

module.exports = router;
