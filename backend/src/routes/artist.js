const router = require("express").Router();
const Artist = require("../models/Artist");
router.get("/", async (req,res)=>{
  const { q } = req.query; const filter = q ? { $text: { $search:q } } : {};
  const items = await Artist.find(filter).limit(200);
  res.json(items);
});
module.exports = router;
