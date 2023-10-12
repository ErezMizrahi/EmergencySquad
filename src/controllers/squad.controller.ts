import { Request, Response } from "express";
import squadService from "../services/squad.service";

export const getMySquad = async (req: Request, res: Response) => {
    res.status(200).json({ });
}

export const createNewSquad = async (req: Request, res: Response) => {
    const { name, location, description, admin, members } = req.body;
    const squad = await squadService.create( { name, location, description, admin, members })
    res.status(200).json(squad);
}

export const addMembers = async (req: Request, res: Response) => {
    const { members, squadId } = req.body;
    await squadService.addMembersToSquad(members, squadId);
    res.status(200).json({"success": true});

} 

export const deleteSquad = (req: Request, res: Response) => {
    res.status(200).send({});
}
