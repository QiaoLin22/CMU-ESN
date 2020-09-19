const { requireAuth } = require("../middleware/authmiddleware");
const router = require("express").Router();

const LoginController = require("../controllers/loginController");
const UserController = require("../controllers/userController");

router.get("/main", requireAuth, (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
});

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/api/login", LoginController.login);

router.post("/api/users", UserController.createUser);

module.exports = router;
