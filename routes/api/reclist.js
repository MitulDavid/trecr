const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const axios = require('axios');

const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const RecList = require('../../models/RecList');

// @route    GET api/reclist/me
// @desc     Get current users reclist (populated with username)
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const reclist = await RecList.findOne({
      user_id: req.user.id,
    }).populate('user_id', ['username']); /*Modified user to user_id */

    if (!reclist) {
      return res.status(400).json({
        errors: [{ msg: 'This user does not have any recommendations' }],
      });
    }
    res.json(reclist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/reclist/user/:user_id
// @desc     Get reclist by user ID (populated with username)
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const reclist = await RecList.findOne({
      user_id: req.params.user_id,
    }).populate('user_id', ['username']); /*Modified user to user_id */

    if (!reclist)
      return res.status(400).json({
        errors: [{ msg: 'This user does not have any recommendations' }],
      });

    res.json(reclist);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        errors: [{ msg: 'This user does not have any recommendations' }],
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route    POST api/reclist/:mediaType/:id
// @desc     Add an entry to the user's reclist. If user has no reclist, it gets created.
// @access   Private

router.post('/:mediaType/:id', auth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${req.params.mediaType}/${
        req.params.id
      }?api_key=${config.get('tmdbKey')}&language=en-US`
    );
    const result = response.data;

    const rl_entry = {};
    rl_entry.r_id = result.id;
    rl_entry.media_type = req.params.mediaType;
    if (req.params.mediaType === 'movie') rl_entry.title = result.title;
    if (req.params.mediaType === 'tv') rl_entry.title = result.name;
    rl_entry.poster_path = result.poster_path;
    if (req.params.mediaType === 'movie')
      rl_entry.release_date = result.release_date;
    if (req.params.mediaType === 'tv')
      rl_entry.release_date = result.first_air_date;
    rl_entry.genre = result.genres.map((ele) => ele.name);
    rl_entry.language = result.original_language;
    rl_entry.rating = result.vote_average;
    rl_entry.likes = [];

    const reclist = await RecList.findOne({
      user_id: req.user.id,
    });

    if (!reclist) {
      const newReclist = new RecList({
        user_id: req.user.id,
        r_list: [rl_entry],
      });
      const r = await newReclist.save();
      return res.json(r);
    }

    if (reclist.r_list.length >= 10) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'The list already has 10 entries. Please delete an entry to add a new one',
          },
        ],
      });
    }
    const checkRep = reclist.r_list.filter(
      (r_ele) => r_ele.title === rl_entry.title
    );
    if (checkRep.length > 0) {
      return res.status(400).json({
        errors: [{ msg: 'That entry already exists in the list' }],
      });
    }

    reclist.r_list.push(rl_entry);
    const r = await reclist.save();
    res.json(r);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/reclist/item/:r_item_id
// @desc     Delete entry from reclist
// @access   Private
router.delete('/item/:r_item_id', auth, async (req, res) => {
  try {
    const reclist = await RecList.findOne({
      user_id: req.user.id,
    });
    //Pull out entry
    const r_item = reclist.r_list.find(
      (r_item) => r_item.id === req.params.r_item_id
    );
    //Ensure entry exists
    if (!r_item) {
      return res.status(404).json({ msg: 'Entry does not exist' });
    }

    const removeIndex = reclist.r_list
      .map((item) => item.id)
      .indexOf(req.params.r_item_id);

    reclist.r_list.splice(removeIndex, 1);

    await reclist.save();

    res.json(reclist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/reclist
// @desc     Delete current user's entire RecList
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    const reclist = await RecList.findOne({
      user_id: req.user.id,
    }).populate('user', ['username']);

    if (!reclist) {
      return res
        .status(400)
        .json({ msg: 'This user does not have any recommendations' });
    }

    await RecList.findOneAndRemove({ user_id: req.user.id });
    res.json({ msg: 'List deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
