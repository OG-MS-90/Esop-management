// models/Esop.js
const mongoose = require("mongoose");

const EsopSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  grantDate: Date,
  exercisePrice: Number,
  vestingSchedule: String,
  expirationDate: Date,
  totalGrants: Number,
  vested: Number,
  unvested: Number,
  exercised: Number,
  ticker: String,
  type: { type: String, default: "ISO" },
  quantity: Number,
  price: Number,
  exerciseDate: Date,
  status: { type: String, default: "Not exercised" },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Esop", EsopSchema);
