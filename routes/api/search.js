const express = require('express');
const router = express.Router();
const request = require('request');
const { check, validationResult } = require('express-validator');
const config = require('config');

const auth = require('../../middleware/auth');

// @route    POST api/search
// @desc     Get search result from TMDB
// @access   Private
router.post(
  '/',
  [
    auth,
    [check('query', 'The search query is required').not().isEmpty().trim()],
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query } = req.body;

      const options = {
        uri: `https://api.themoviedb.org/3/search/multi?api_key=${config.get(
          'tmdbKey'
        )}&language=en-US&query=${encodeURI(query)}&page=1&include_adult=false`,
        method: 'GET',
      };

      request(options, (error, response, body) => {
        if (error) console.error(error);

        if (response.statusCode !== 200) {
          return res.status(404).json({ msg: 'No data found' });
        }

        res.json(
          JSON.parse(body).results.sort(function (a, b) {
            var keyA = a.popularity,
              keyB = b.popularity;
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          })
        );
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
