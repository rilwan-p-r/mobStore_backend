import jwt from 'jsonwebtoken';
export const generateToken =(res,userId,tokenName)=>{
    const token = jwt.sign({userId},process.env.SECRET_KEY,{
        expiresIn:'1d'
    });
    res.cookie(tokenName,token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'Strict',
        maxAge: 24 * 60 * 60 * 1000
    })
}