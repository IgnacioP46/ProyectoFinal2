const jwt = require("jsonwebtoken");
module.exports = (roles = []) => (req,res,next)=>{
  const token = (req.headers.authorization||"").replace(/^Bearer /,"");
  if(!token) return res.status(401).json({error:"No token"});
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(payload.role)) return res.status(403).json({error:"Forbidden"});
    req.user = payload; next();
  }catch(e){ return res.status(401).json({error:"Invalid token"}); }
};
