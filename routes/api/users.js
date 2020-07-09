const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const nodemailer = require('nodemailer');
const auth = require('../../middleware/auth');
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
          const url = `${config.get('user-verify')}/${token}`; //Confirmation Link
          transporter.sendMail({
            from: 'no-reply@trecr.com',
            to: email,
            subject: 'Welcome to trecr | Verify your email',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                  <!--[if !mso]><!-->
                  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                  <!--<![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
                  <xml>
                    <o:OfficeDocumentSettings>
                      <o:AllowPNG/>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                  </xml>
                  <![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
              <style type="text/css">
                body {width: 600px;margin: 0 auto;}
                table {border-collapse: collapse;}
                table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
                img {-ms-interpolation-mode: bicubic;}
              </style>
            <![endif]-->
                  <style type="text/css">
                body, p, div {
                  font-family: arial,helvetica,sans-serif;
                  font-size: 16px;
                }
                body {
                  color: #000000;
                }
                body a {
                  color: #000000;
                  text-decoration: none;
                }
                p { margin: 0; padding: 0; }
                table.wrapper {
                  width:100% !important;
                  table-layout: fixed;
                  -webkit-font-smoothing: antialiased;
                  -webkit-text-size-adjust: 100%;
                  -moz-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                }
                img.max-width {
                  max-width: 100% !important;
                }
                .column.of-2 {
                  width: 50%;
                }
                .column.of-3 {
                  width: 33.333%;
                }
                .column.of-4 {
                  width: 25%;
                }
                @media screen and (max-width:480px) {
                  .preheader .rightColumnContent,
                  .footer .rightColumnContent {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent div,
                  .preheader .rightColumnContent span,
                  .footer .rightColumnContent div,
                  .footer .rightColumnContent span {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent,
                  .preheader .leftColumnContent {
                    font-size: 80% !important;
                    padding: 5px 0;
                  }
                  table.wrapper-mobile {
                    width: 100% !important;
                    table-layout: fixed;
                  }
                  img.max-width {
                    height: auto !important;
                    max-width: 100% !important;
                  }
                  a.bulletproof-button {
                    display: block !important;
                    width: auto !important;
                    font-size: 80%;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                  }
                  .columns {
                    width: 100% !important;
                  }
                  .column {
                    display: block !important;
                    width: 100% !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                  }
                  .social-icon-column {
                    display: inline-block !important;
                  }
                }
              </style>
                  <!--user entered Head Start-->
            
                 <!--End Head user entered-->
                </head>
                <body>
                  <center class="wrapper" data-link-color="#000000" data-body-style="font-size:16px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#F5F5F5;">
                    <div class="webkit">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#F5F5F5">
                        <tr>
                          <td valign="top" bgcolor="#F5F5F5" width="100%">
                            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="100%">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td>
                                        <!--[if mso]>
                <center>
                <table><tr><td width="600">
              <![endif]-->
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                  <tr>
                                                    <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#F5F5F5" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                <tr>
                  <td role="module-content">
                    <p>Verify your email to start using trecr.</p>
                  </td>
                </tr>
              </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="98ndJyAY9BSGjoVqrr6FYx">
                  <tbody><tr>
                    <td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" valign="top" align="center">
                      <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:25% !important; width:25%; height:auto !important;" src="http://cdn.mcauto-images-production.sendgrid.net/a1f0e1d27c548f1e/f433a97e-a16b-4089-bdc6-0d309bc4fc23/314x205.png" alt="Off Grid Adventures" width="150" data-responsive="true" data-proportionally-constrained="false">
                    </td>
                  </tr>
                </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#FFFFFF">
                <tbody>
                  <tr role="module-content">
                    <td height="100%" valign="top"><table width="520" style="width:520px; border-spacing:0; border-collapse:collapse; margin:0px 40px 0px 40px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                  <tbody>
                    <tr>
                      <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d04c0f59-3153-4f1c-9795-28653376cafe" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:70px 30px 20px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: arial, helvetica, sans-serif; font-size: 30px"><strong>Welcome to trecr !</strong></span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="4d375687-e201-43db-8e38-91254922df7e" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:0px 30px 10px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">Hey ${user.username},</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="508080a8-b434-423a-b12e-683650b40160" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:0px 30px 0px 30px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px">Thanks for signing up! Click the button below to validate your account and confirm we've got the right email address.</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="e1108c8b-fe67-42ab-97b8-72ae6abe6bd9">
                  <tbody>
                    <tr>
                      <td align="left" bgcolor="" class="outer-td" style="padding:35px 30px 65px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                          <tbody>
                            <tr>
                            <td align="center" bgcolor="#E02F2F" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                              <a href="${url}" style="background-color:#E02F2F; border:0px solid #333333; border-color:#333333; border-radius:5px; border-width:0px; color:#ffffff; display:inline-block; font-size:18px; font-weight:bold; letter-spacing:0px; line-height:normal; padding:12px 25px 12px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:arial,helvetica,sans-serif;" target="_blank">Verify Email</a>
                            </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table></td>
                    </tr>
                  </tbody>
                </table></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="0b8f1d03-6199-4ae4-b519-c087843777be" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:20px 25px 20px 25px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 14px; color: #a9a9a9; font-family: arial, helvetica, sans-serif">If you didn't sign up for an account on our site, please ignore this email.&nbsp;</span></div>
            <div style="font-family: inherit; text-align: center"><span style="font-size: 14px; color: #a9a9a9; font-family: arial, helvetica, sans-serif">Report any issues at https://discord.gg/9MEzZXB</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table></td>
                                                  </tr>
                                                </table>
                                                <!--[if mso]>
                                              </td>
                                            </tr>
                                          </table>
                                        </center>
                                        <![endif]-->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </center>
                </body>
              </html>`,
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
          const url = `${config.get('user-verify')}/${token}`; //Confirmation Link
          transporter.sendMail({
            from: 'no-reply@trecr.com',
            to: email,
            subject: 'Welcome to trecr | Verify your email',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                  <!--[if !mso]><!-->
                  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                  <!--<![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
                  <xml>
                    <o:OfficeDocumentSettings>
                      <o:AllowPNG/>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                  </xml>
                  <![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
              <style type="text/css">
                body {width: 600px;margin: 0 auto;}
                table {border-collapse: collapse;}
                table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
                img {-ms-interpolation-mode: bicubic;}
              </style>
            <![endif]-->
                  <style type="text/css">
                body, p, div {
                  font-family: arial,helvetica,sans-serif;
                  font-size: 16px;
                }
                body {
                  color: #000000;
                }
                body a {
                  color: #000000;
                  text-decoration: none;
                }
                p { margin: 0; padding: 0; }
                table.wrapper {
                  width:100% !important;
                  table-layout: fixed;
                  -webkit-font-smoothing: antialiased;
                  -webkit-text-size-adjust: 100%;
                  -moz-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                }
                img.max-width {
                  max-width: 100% !important;
                }
                .column.of-2 {
                  width: 50%;
                }
                .column.of-3 {
                  width: 33.333%;
                }
                .column.of-4 {
                  width: 25%;
                }
                @media screen and (max-width:480px) {
                  .preheader .rightColumnContent,
                  .footer .rightColumnContent {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent div,
                  .preheader .rightColumnContent span,
                  .footer .rightColumnContent div,
                  .footer .rightColumnContent span {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent,
                  .preheader .leftColumnContent {
                    font-size: 80% !important;
                    padding: 5px 0;
                  }
                  table.wrapper-mobile {
                    width: 100% !important;
                    table-layout: fixed;
                  }
                  img.max-width {
                    height: auto !important;
                    max-width: 100% !important;
                  }
                  a.bulletproof-button {
                    display: block !important;
                    width: auto !important;
                    font-size: 80%;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                  }
                  .columns {
                    width: 100% !important;
                  }
                  .column {
                    display: block !important;
                    width: 100% !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                  }
                  .social-icon-column {
                    display: inline-block !important;
                  }
                }
              </style>
                  <!--user entered Head Start-->
            
                 <!--End Head user entered-->
                </head>
                <body>
                  <center class="wrapper" data-link-color="#000000" data-body-style="font-size:16px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#F5F5F5;">
                    <div class="webkit">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#F5F5F5">
                        <tr>
                          <td valign="top" bgcolor="#F5F5F5" width="100%">
                            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="100%">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td>
                                        <!--[if mso]>
                <center>
                <table><tr><td width="600">
              <![endif]-->
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                  <tr>
                                                    <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#F5F5F5" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                <tr>
                  <td role="module-content">
                    <p>Verify your email to start using trecr.</p>
                  </td>
                </tr>
              </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="98ndJyAY9BSGjoVqrr6FYx">
                  <tbody><tr>
                    <td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" valign="top" align="center">
                      <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:25% !important; width:25%; height:auto !important;" src="http://cdn.mcauto-images-production.sendgrid.net/a1f0e1d27c548f1e/f433a97e-a16b-4089-bdc6-0d309bc4fc23/314x205.png" alt="Off Grid Adventures" width="150" data-responsive="true" data-proportionally-constrained="false">
                    </td>
                  </tr>
                </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#FFFFFF">
                <tbody>
                  <tr role="module-content">
                    <td height="100%" valign="top"><table width="520" style="width:520px; border-spacing:0; border-collapse:collapse; margin:0px 40px 0px 40px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                  <tbody>
                    <tr>
                      <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d04c0f59-3153-4f1c-9795-28653376cafe" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:70px 30px 20px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: arial, helvetica, sans-serif; font-size: 30px"><strong>Welcome to trecr !</strong></span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="4d375687-e201-43db-8e38-91254922df7e" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:0px 30px 10px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">Hey ${user.username},</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="508080a8-b434-423a-b12e-683650b40160" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:0px 30px 0px 30px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px">Thanks for signing up! Click the button below to validate your account and confirm we've got the right email address.</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="e1108c8b-fe67-42ab-97b8-72ae6abe6bd9">
                  <tbody>
                    <tr>
                      <td align="left" bgcolor="" class="outer-td" style="padding:35px 30px 65px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                          <tbody>
                            <tr>
                            <td align="center" bgcolor="#E02F2F" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                              <a href="${url}" style="background-color:#E02F2F; border:0px solid #333333; border-color:#333333; border-radius:5px; border-width:0px; color:#ffffff; display:inline-block; font-size:18px; font-weight:bold; letter-spacing:0px; line-height:normal; padding:12px 25px 12px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:arial,helvetica,sans-serif;" target="_blank">Verify Email</a>
                            </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table></td>
                    </tr>
                  </tbody>
                </table></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="0b8f1d03-6199-4ae4-b519-c087843777be" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:20px 25px 20px 25px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 14px; color: #a9a9a9; font-family: arial, helvetica, sans-serif">If you didn't sign up for an account on our site, please ignore this email.&nbsp;</span></div>
            <div style="font-family: inherit; text-align: center"><span style="font-size: 14px; color: #a9a9a9; font-family: arial, helvetica, sans-serif">Report any issues at https://discord.gg/9MEzZXB</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table></td>
                                                  </tr>
                                                </table>
                                                <!--[if mso]>
                                              </td>
                                            </tr>
                                          </table>
                                        </center>
                                        <![endif]-->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </center>
                </body>
              </html>`,
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
          const url = `${config.get('user-resetpassword')}/${token}`; //Confirmation Link
          transporter.sendMail({
            from: 'no-reply@trecr.com',
            to: email,
            subject: 'Reset your password | trecr',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                  <!--[if !mso]><!-->
                  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                  <!--<![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
                  <xml>
                    <o:OfficeDocumentSettings>
                      <o:AllowPNG/>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                  </xml>
                  <![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
              <style type="text/css">
                body {width: 600px;margin: 0 auto;}
                table {border-collapse: collapse;}
                table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
                img {-ms-interpolation-mode: bicubic;}
              </style>
            <![endif]-->
                  <style type="text/css">
                body, p, div {
                  font-family: arial,helvetica,sans-serif;
                  font-size: 16px;
                }
                body {
                  color: #000000;
                }
                body a {
                  color: #000000;
                  text-decoration: none;
                }
                p { margin: 0; padding: 0; }
                table.wrapper {
                  width:100% !important;
                  table-layout: fixed;
                  -webkit-font-smoothing: antialiased;
                  -webkit-text-size-adjust: 100%;
                  -moz-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                }
                img.max-width {
                  max-width: 100% !important;
                }
                .column.of-2 {
                  width: 50%;
                }
                .column.of-3 {
                  width: 33.333%;
                }
                .column.of-4 {
                  width: 25%;
                }
                @media screen and (max-width:480px) {
                  .preheader .rightColumnContent,
                  .footer .rightColumnContent {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent div,
                  .preheader .rightColumnContent span,
                  .footer .rightColumnContent div,
                  .footer .rightColumnContent span {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent,
                  .preheader .leftColumnContent {
                    font-size: 80% !important;
                    padding: 5px 0;
                  }
                  table.wrapper-mobile {
                    width: 100% !important;
                    table-layout: fixed;
                  }
                  img.max-width {
                    height: auto !important;
                    max-width: 100% !important;
                  }
                  a.bulletproof-button {
                    display: block !important;
                    width: auto !important;
                    font-size: 80%;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                  }
                  .columns {
                    width: 100% !important;
                  }
                  .column {
                    display: block !important;
                    width: 100% !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                  }
                  .social-icon-column {
                    display: inline-block !important;
                  }
                }
              </style>
                  <!--user entered Head Start-->
            
                 <!--End Head user entered-->
                </head>
                <body>
                  <center class="wrapper" data-link-color="#000000" data-body-style="font-size:16px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#F5F5F5;">
                    <div class="webkit">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#F5F5F5">
                        <tr>
                          <td valign="top" bgcolor="#F5F5F5" width="100%">
                            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="100%">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td>
                                        <!--[if mso]>
                <center>
                <table><tr><td width="600">
              <![endif]-->
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                  <tr>
                                                    <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#F5F5F5" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                <tr>
                  <td role="module-content">
                    <p>We received a request to reset your password.</p>
                  </td>
                </tr>
              </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="98ndJyAY9BSGjoVqrr6FYx">
                  <tbody><tr>
                    <td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" valign="top" align="center">
                      <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:25% !important; width:25%; height:auto !important;" src="http://cdn.mcauto-images-production.sendgrid.net/a1f0e1d27c548f1e/f433a97e-a16b-4089-bdc6-0d309bc4fc23/314x205.png" alt="Off Grid Adventures" width="150" data-responsive="true" data-proportionally-constrained="false">
                    </td>
                  </tr>
                </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#FFFFFF">
                <tbody>
                  <tr role="module-content">
                    <td height="100%" valign="top"><table width="520" style="width:520px; border-spacing:0; border-collapse:collapse; margin:0px 40px 0px 40px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                  <tbody>
                    <tr>
                      <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d04c0f59-3153-4f1c-9795-28653376cafe" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:70px 30px 20px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: arial, helvetica, sans-serif; font-size: 30px"><strong>Forgot your password?</strong></span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="4d375687-e201-43db-8e38-91254922df7e" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:0px 30px 10px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">Hey ${user.username},</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="508080a8-b434-423a-b12e-683650b40160" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:0px 30px 0px 30px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 18px">We've received a request to reset the password for your trecr account. Click the button below to reset your password.</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="e1108c8b-fe67-42ab-97b8-72ae6abe6bd9">
                  <tbody>
                    <tr>
                      <td align="left" bgcolor="" class="outer-td" style="padding:35px 30px 65px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                          <tbody>
                            <tr>
                            <td align="center" bgcolor="#E02F2F" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                              <a href="${url}" style="background-color:#E02F2F; border:0px solid #333333; border-color:#333333; border-radius:5px; border-width:0px; color:#ffffff; display:inline-block; font-size:18px; font-weight:bold; letter-spacing:0px; line-height:normal; padding:12px 25px 12px 25px; text-align:center; text-decoration:none; border-style:solid; font-family:arial,helvetica,sans-serif;" target="_blank">Reset Password</a>
                            </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table></td>
                    </tr>
                  </tbody>
                </table></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="0b8f1d03-6199-4ae4-b519-c087843777be" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:20px 25px 20px 25px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 14px; color: #a9a9a9; font-family: arial, helvetica, sans-serif">If you didn't mean to reset your password, simply ignore this email; your password will not change. Report any issues at https://discord.gg/9MEzZXB </span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table></td>
                                                  </tr>
                                                </table>
                                                <!--[if mso]>
                                              </td>
                                            </tr>
                                          </table>
                                        </center>
                                        <![endif]-->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </center>
                </body>
              </html>`,
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
router.post(
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

//@route   POST api/users/changeusername
//@desc    Change logged in user's username
//@access  Private
router.post(
  '/changeusername',
  [
    auth,
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
      check('password', 'Password is required').exists(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Request' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Password' }] });
      }

      if (username === user.username) {
        return res.status(400).json({
          errors: [
            {
              msg: 'The new username and the old username cannot be the same.',
            },
          ],
        });
      }

      let userCheck = await User.findOne({ username });
      if (userCheck) {
        return res.status(400).json({
          errors: [
            { msg: 'That username already exists. Please pick another one' },
          ],
        });
      }

      user.username = username;
      await user.save();

      return res.status(200).json({ msg: 'Username Changed' });
    } catch (err) {
      console.error(err.message);
      if (err.message === 'invalid token') {
        return res.status(400).json({ errors: [{ msg: 'Invalid Request' }] });
      }
      res.status(500).send('Server Error');
    }
  }
);

//@route   POST api/users/changepassword
//@desc    Change logged in user's password
//@access  Private
router.post(
  '/changepassword',
  [
    auth,
    [
      check('password', 'Password is required').exists(),
      check('newpassword', 'Password must be atleast 6 characters').isLength({
        min: 6,
      }),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password, newpassword } = req.body;
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Request' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Password' }] });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newpassword, salt);
      await user.save();

      return res.status(200).json({ msg: 'Password Changed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
