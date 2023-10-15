import { Request, Response } from "express";
import userService from "../services/user.service";

export const getCurrentUser = async (req: Request, res: Response) => {
    res.status(200).json({ currentUser: req.currentUser || null });
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const existingUser = await userService.isUserExists(email, password);

    const token = userService.generateJwt({
        id: existingUser.id,
        email: existingUser.email,
        pushToken: existingUser.pushToken
    });

    res.cookie('jwt', token);
    
    res.status(200).json(existingUser);
}

export const signout = (req: Request, res: Response) => {
    res.clearCookie("jwt").status(200).send({});
}

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);

    const token = userService.generateJwt({
        id: user.id,
        email: user.email,
        pushToken: undefined,
    });
  
    res.cookie('jwt', token);

    res.status(201).json(user);
}


export const updatePushToken = async (req: Request, res: Response) => {
    const pushToken = req.params.pushToken;
    const currentUserEmail = req.currentUser!.email;

    const existingUser = await userService.updatePushToken(pushToken, currentUserEmail);

    if(existingUser) {
        const token = userService.generateJwt({
            id: existingUser.id,
            email: existingUser.email,
            pushToken: existingUser.pushToken
        });
    
        res.cookie('jwt', token);
        res.status(201).json({});
    }
    
    res.status(500).end();
}