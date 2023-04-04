const express = require("express");
const { getAllPublicRoutines, createRoutine } = require("../db");
const { requireUser } = require("./Utils");
const router = express.Router();

// GET /api/routines

router.get("/", async (req, res, next) => {
  try {
    const allPublicRoutines = await getAllPublicRoutines();
    res.send(allPublicRoutines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const creatorId = req.user.id;

  try {
    if (!req.user) {
      next({
        name: "Requires logged in user",
        message: "you must be logged in to perform this action",
      });
      //   const id = await getRoutineById;
    } else {
      const postRoutine = await createRoutine({
        creatorId,
        isPublic,
        name,
        goal,
      });
      if (postRoutine) {
        res.send(postRoutine);
      } else {
        next({
          message:
            "message: 'An error was encountered trying to create routine. Please try again.",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
