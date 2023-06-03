import jwt from "jsonwebtoken";
// generate token 
export const tokenGenerator = ({
    payload={},
    signature = process.env.TOKEN_KEY,
   
} ={}) => {
  if (Object.keys(payload).length) {
    const token = jwt.sign(payload,signature);
    return token 
  }
  return false;
}

// decode token 
export const tokenDecode = ({
    payload='',
    signature = process.env.TOKEN_KEY,

} ={}) => {
  if (!payload) {
    return false;
  
  }
  const decode = jwt.verify(payload,signature);
  return decode 
}
