const mongoose = require('mongoose');

const RecListSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  r_list: [
    {
      r_id: {
        type: String,
        required: true,
      },
      media_type: {
        type: String,
        required: true,
      },
      title: {
        type: String,
      },
      poster_path: {
        type: String,
      },
      release_date: {
        type: String,
      },
      genre: [String],
      language: {
        type: String,
      },
      rating: {
        type: String,
      },
      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
          },
        },
      ],
    },
  ],
});

module.exports = RecList = mongoose.model('reclist', RecListSchema);
