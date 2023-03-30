/* eslint-disable no-useless-catch */
const express = require("express");
const { createUser, getUserByUsername, getUser } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PasswordTooShortError, UserTakenError } = require("../errors");
const { requireUser } = require("./Utils");
const { JWT_SECRET } = process.env;

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, id, password } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      res.send({
        name: "ErrorUserExists",
        message: UserTakenError(username),
        error: "error",
      });
    }

    if (password.length < 8) {
      res.send({
        name: "PasswordLengthError",
        message: PasswordTooShortError(),
        error: "error",
      });
    }

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: id,
        username,
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.send({
      message: "Thank you for registering",
      token,
      user,
    });
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// POST /api/users/login

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      // create token & return to user
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET
      );
      res.send({ message: "you're logged in!", user, token });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me

router.get("/me", requireUser, async (req, res, next) => {
  try {
    console.log("HERE: ");
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines

module.exports = router;
