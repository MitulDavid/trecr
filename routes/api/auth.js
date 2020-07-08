const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const axios = require('axios');

const auth = require('../../middleware/auth');
const User = require('../../models/Users');

//@route   GET api/auth
//@desc    Send user data if request is authenticated
//@access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/auth
//@desc    Authenticate user (Login) and get token
//@access  Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      if (!user.verified) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please verify your email to login' }] });
        //@note: msg here is checked in front-end to identify error case; note when changing msg
      }

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

//@route   POST api/auth/verifycaptcha
//@desc    Verify recaptcha token
//@access  Public
router.post('/verifycaptcha', async (req, res) => {
  try {
    if (!req.body.captcha)
      return res
        .status(400)
        .json({ success: false, msg: 'Captcha not completed' });

    // Secret key
    const secretKey = config.get('recaptchaSecret');

    // Verify URL
    const query = new URLSearchParams({
      secret: secretKey,
      response: req.body.captcha,
      remoteip: req.connection.remoteAddress,
    }).toString();

    // Make a request to verifyURL
    const body = await axios.post(
      `https://google.com/recaptcha/api/siteverify?${query}`
    );

    // console.log(body);
    // If not successful
    if (body.data.success !== undefined && !body.data.success)
      return res
        .status(400)
        .json({ success: false, msg: 'Failed captcha verification' });

    // If successful
    return res.json({ success: true, msg: 'Captcha passed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
