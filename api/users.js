/* eslint-disable no-useless-catch */
const express = require("express");
const { createUser, getUserByUsername } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PasswordTooShortError, UserTakenError } = require("../errors");
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

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
