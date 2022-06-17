const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const PinnedList = require('../../models/PinnedList');
const config = require('config');

// @route    GET api/pinnedlist/me
// @desc     Get current user's pinnedlist (populated with username)
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const pinnedlist = await PinnedList.findOne({
      user_id: req.user.id,
    })
      .populate('p_list.user', ['username'])
      .populate('user_id', ['username']);

    if (!pinnedlist) {
      return res.status(400).json({
        msg: 'This user doesnt have any pinned lists',
      });
    }
    res.json(pinnedlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/pinnedlist/:user_id
// @desc     Add userid to current user's pinnedlists
// @access   Private

router.post('/:user_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('_id');
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: 'Invalid request. List cannot be pinned' }],
      });
    }

    const pinnedlist = await PinnedList.findOne({
      user_id: req.user.id,
    });

    if (!pinnedlist) {
      const newPinnedList = new PinnedList({
        user_id: req.user.id,
        p_list: [{ user: req.params.user_id }],
      });
      const r = await newPinnedList.save();
      return res.json(r);
    }

    if (pinnedlist.p_list.length >= 50) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'You can only pin upto 50 lists. Unpin a list to pin another one.',
          },
        ],
      });
    }

    const checkRep = pinnedlist.p_list.filter(
      (p_ele) => p_ele.user == req.params.user_id
    );

    if (checkRep.length > 0) {
      return res.status(400).json({
        errors: [{ msg: 'This list has already been pinned' }],
      });
    }

    pinnedlist.p_list.push({ user: req.params.user_id });
    const r = await pinnedlist.save();
    res.json(r);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid request. List cannot be pinned' }] });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/pinnedlist/:user_id
// @desc     Delete userid from current user's pinnedlists
// @access   Private

router.delete('/:user_id', auth, async (req, res) => {
  try {
    const pinnedlist = await PinnedList.findOne({
      user_id: req.user.id,
    })
      .populate('p_list.user', ['username'])
      .populate('user_id', ['username']);
    //Pull out entry
    const p_item = pinnedlist.p_list.find(
      (p_item) => p_item.user._id.toString() === req.params.user_id
    );
    //Ensure entry exists
    if (!p_item) {
      return res.status(404).json({
        errors: [{ msg: 'Entry does not exist' }],
      });
    }

    const removeIndex = pinnedlist.p_list
      .map((item) => item.user)
      .indexOf(req.params.user_id);

    pinnedlist.p_list.splice(removeIndex, 1);
    await pinnedlist.save();
    res.json(pinnedlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
