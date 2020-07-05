const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const nodemailer = require('nodemailer');

const User = require('../../models/Users');

//Email Transport
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: config.get('sgUser'),
    pass: config.get('sgKey'),
  },
});

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
      .trim()
      .customSanitizer((value) => {
        return value.toLowerCase();
      }),
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
        { expiresIn: 7200 },
        (err, token) => {
          if (err) throw err;
          //@todo: change url to frontend route
          const url = `http://localhost:3000/user/verify/${token}`; //Confirmation Link
          transporter.sendMail({
            from: 'no-reply@trecr.com',
            to: email,
            subject: 'Welcome to trecr! Confirm your email',
            //@todo: CSS for email body
            html: `Please click this to confirm your email: <a href="${url}">${url}</a>`,
          });
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route   GET api/users/confirmation/:token
//@desc    Verify User
//@access  Public
router.get('/confirmation/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, config.get('jwtSecret'));
    userid = decoded.user.id;
    let user = await User.findById(userid);
    if (!user) {
      //@todo: on the frontend show resend verification link
      return res.status(400).json({ errors: [{ msg: 'Invalid Token' }] });
    }
    if (user.verified) {
      return res.status(200).json({ msg: 'User Already Verified' });
    }
    user.verified = true;
    await user.save();
    return res.status(200).json({ msg: 'User Verified' });
  } catch (err) {
    if (err.message === 'invalid token') {
      ///@todo: on the frontend show resend verification link
      return res.status(400).json({ errors: [{ msg: 'Invalid Token' }] });
    }
    res.status(500).send('Server Error');
  }
});

//@route   POST api/users/resendverification
//@desc    Resend user verification email
//@access  Public
router.post(
  '/resendverification',
  [check('email', 'Please enter a valid email').isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] });
      }
      if (user.verified === true) {
        return res.status(400).json({
          errors: [
            {
              msg: 'This user has already verified their email, please log in',
            },
          ],
        });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 14400 },
        (err, token) => {
          if (err) throw err;
          //@todo: change url to frontend route
          const url = `http://localhost:3000/user/verify/${token}`; //Confirmation Link
          transporter.sendMail({
            from: 'no-reply@trecr.com',
            to: email,
            subject: 'Welcome to trecr! Confirm your email',
            //@todo: CSS for email body
            html: `Please click this to confirm your email: <a href="${url}">${url}</a>`,
          });
          res.json({ msg: 'Email re-sent' });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route   POST api/users/forgotpassword
//@desc    Send password reset email
//@access  Public
router.post(
  '/forgotpassword',
  [check('email', 'Please enter a valid email').isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] });
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
          //@todo: change url to frontend route
          const url = `http://localhost:3000/user/resetpassword/${token}`; //Confirmation Link
          transporter.sendMail({
            from: 'no-reply@trecr.com',
            to: email,
            subject: 'Password Reset Request | trecr',
            //@todo: CSS for email body
            html: `Please click this to reset your password: <a href="${url}">${url}</a>`,
          });
          res.json({ msg: 'Password Reset Email Sent' });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route   POST api/users/resetpassword/:token
//@desc    Reset User's Password
//@access  Public
router.get(
  '/resetpassword/:token',
  [
    check('password', 'Password must be atleast 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password } = req.body;

      const decoded = jwt.verify(req.params.token, config.get('jwtSecret'));
      userid = decoded.user.id;
      let user = await User.findById(userid);

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Request' }] });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      return res.status(200).json({ msg: 'Password Changed' });
    } catch (err) {
      if (err.message === 'invalid token') {
        return res.status(400).json({ errors: [{ msg: 'Invalid Request' }] });
      }
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
