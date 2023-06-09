const express = require("express");
const router = express.Router();
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");

router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const user = jwt.verify(token, JWT_SECRET);

      if (user.id) {
        req.user = await getUserById(user.id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// GET /api/health
router.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "API Healthy" });
  } catch (error) {
    next(error);
  }
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

router.use((error, req, res, next) => {
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
  });
});

module.exports = router;
