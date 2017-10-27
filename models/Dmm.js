const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MakerSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    index: true,
    unique: true
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Pickups'
    }
  ]
});

const PickupSchema = Schema({
  name: String,
  url: String,
  maker: {
    type: Schema.Types.ObjectId,
    ref: 'Maker'
  },
  makerUrl: String,
  updated_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Pickups', PickupSchema);
module.exports = mongoose.model('Maker', MakerSchema);
