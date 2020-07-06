const mongoose = require('mongoose');

const PinnedListSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  p_list: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
  ],
});

module.exports = PinnedList = mongoose.model('pinnedlist', PinnedListSchema);
