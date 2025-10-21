const router = require("express").Router();
const Order = require("../models/Order.models");
const Vinyl = require("../models/Vinyl.models");
const auth = require("../middleware/auth");

router.post("/", auth(), async (req,res)=>{
  const { items } = req.body; // [{vinylId, qty}]
  const lines = [];
  for (const it of items){
    const v = await Vinyl.findById(it.vinylId);
    if (!v || v.stock < it.qty) return res.status(400).json({error:"Stock not available"});
    lines.push({ vinyl:v._id, qty:it.qty, priceAtPurchase:v.priceEur });
  }
  const total = lines.reduce((s,l)=> s + l.qty*l.priceAtPurchase, 0);
  const order = await Order.create({ user:req.user.id, items:lines, total });
  await Promise.all(lines.map(l=> Vinyl.findByIdAndUpdate(l.vinyl, { $inc: { stock: -l.qty } })));
  res.json(order);
});

router.get("/my", auth(), async (req,res)=>{
  const orders = await Order.find({ user:req.user.id }).populate("items.vinyl");
  res.json(orders);
});

module.exports = router;
