import { Request, Response } from "express";
import squadService from "../services/squad.service";
import { UserDocument } from "../models/user.model";



export const getMySquad = async (req: Request, res: Response) => {
    res.status(200).json({ });
}

export const createNewSquad = async (req: Request, res: Response) => {
    const { name, location, description, members } = req.body;
    const currentUserId = req.currentUser!.id;
    const squad = await squadService.create( { name, location, description, members, currentUserId });
    res.status(200).json(squad);
}

export const addMembers = async (req: Request, res: Response) => {
    const { members, squadId } = req.body;
    const squad = await squadService.addMembersToSquad(members, squadId);
    res.status(200).json(squad);

} 

export const deleteSquad = (req: Request, res: Response) => {
    res.status(200).send({});
}
