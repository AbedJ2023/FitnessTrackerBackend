const express = require("express");
const { getAllActivities, createActivity } = require("../db");
const { requireUser } = require("./Utils");
const router = express.Router();

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });
    if (!newActivity) {
      next({ name, message: `An activity with name ${name} already exists` });
    } else {
      res.send(newActivity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

module.exports = router;
