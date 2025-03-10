import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import jwt from 'jsonwebtoken'
import {v4 as uuidv4} from "uuid";

function generateToken(userId:string,email:string,role:string){
    const accessToken = jwt.sign(
        {
            userId,
            email,
            role
        }, process.env.JWT_SECRET!,{expiresIn:"60m"} 

    )
    const refreshToken = uuidv4()
    return {accessToken,refreshToken}


}

async function setToken(res:Response,accessToken:string,refreshToken:string){
    res.cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:60*60*1000
    })
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:60*60*24*7*1000 // 7 days
    })
}

export const register = async(req:Request, res:Response):Promise<void> => {
try {

const {name,email,password} = req.body

const existingUser = await prisma.user.findUnique({
    where:{email}
})
if(existingUser){
    res.status(400).json({message:'User already exists'})
}

const hashPassword = await bcrypt.hash(password , 10)
const user = await prisma.user.create({
    data:{
        name,
        email,
        password:hashPassword,
        role:'USER'
    }
})

res.status(201).json({message: " created successfully", success:true,userId:user.id})




} catch (error) {
    console.error(`Error registering user: ${error}`);
    res.status(500).json({message: 'Error registering user'});
}
}


export const login = async (req:Request, res:Response):Promise<void> =>{
    try {
        const {email,password} = req.body
        const extractCurrentUser = await prisma.user.findUnique({
            where:{email}
        })
        if(!extractCurrentUser || !(await bcrypt.compare(password,extractCurrentUser.password))){
            res.status(401).json({message:'Invalid Credentials',success:false})
            return;
        }
  //create a token here
 
 
const {accessToken,refreshToken} = generateToken(
    extractCurrentUser.id,
    extractCurrentUser.email,
    extractCurrentUser.role
)

// Add a check to ensure the token generation was successful

await setToken(res,accessToken,refreshToken)
res.status(200).json({message:'Logged in successfully',success:true,
    user:{
        id:extractCurrentUser?.id,
        name:extractCurrentUser?.name,
        email:extractCurrentUser?.email,
        role:extractCurrentUser?.role
    }
})



    } catch (error) {
        console.error(`Error logging in user: ${error}`);
        res.status(500).json({message: 'Error logging in user'});
    }
}


export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ message: 'Invalid Credentials', success: false });
        return;
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid Credentials', success: false });
            return;
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken(user.id, user.email, user.role);

        // Update the user's refresh token in the database
        await prisma.user.update({
            where: { id: user.id },
            data: { refresh_token: newRefreshToken }
        });

        // Set the new tokens in the response cookies
        setToken(res, accessToken, newRefreshToken);

        res.status(200).json({ success: true, message: "Token refreshed successfully" });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: 'Error refreshing access token' });
    }
};

export const logout = async (req:Request,res:Response):Promise<void> =>{
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({success:true,message:'Logged out successfully'})
        
    } catch (error) {
        console.error(`Error logging out user: ${error}`);
        res.status(500).json({message: 'Error logging out user'});
    }
}




