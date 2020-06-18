const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

const User = require('../../models/Users');

//@route   POST api/users
//@desc    Register a new user and return token
//@access  public
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),

    check('username', 'Username must be less than 20 characters')
      .isLength({
        max: 20,
      })
      .trim(),
    check(
      'username',
      'Username must contain only letters, numbers, underscores.'
    ).matches('^[a-zA-Z0-9_]+$', 'i'),

    check('password', 'Password must be atleast 6 characters').isLength({
      min: 6,
    }),
    check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    try {
      let userCheck = await User.findOne({ username });
      if (userCheck) {
        return res.status(400).json({
          errors: [
            { msg: 'That username already exists. Please pick another one' },
          ],
        });
      }
      let emailCheck = await User.findOne({ email });
      if (emailCheck) {
        return res.status(400).json({
          errors: [
            {
              msg:
                'That email address has already been registered. Please login, or register with another email id',
            },
          ],
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
