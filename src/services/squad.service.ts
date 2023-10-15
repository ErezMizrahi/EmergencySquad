import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import { Squad, SquadAttrs, SquadDocument } from "../models/squad.model";
import { User, UserDocument } from "../models/user.model";

interface SquadRequestAttrs {
    name: string;
    description: string;
    location: string;
    members: UserDocument[];
    currentUserId: string;
}

class SquadService {

    async getSquad(currentUserId: string): Promise<SquadDocument | null> {
        const squad = await Squad.findOne({admin: currentUserId}).populate('members');
        return squad;
    }

    async create(squad: SquadRequestAttrs): Promise<SquadDocument | null> {
        const adminUser = await User.findOne({_id: squad.currentUserId}) as UserDocument;

        const squadFromDb = await Squad.findOne({name: squad.name});
        if(squadFromDb) {
            throw new BadRequestError(' squad name is already in use ');
        }

        adminUser.set({ isMemberInSquad: true });
        await adminUser.save();

        const newSquad = Squad.build({
            name: squad.name,
            description: squad.description,
            location: squad.location,
            admin: adminUser
        });

        await newSquad.save();

        return this.addMembersToSquad([adminUser.email], newSquad.id);
    }
    
    async addMembersToSquad(membersEmails: string[], squadId: string) {
        const squad = await Squad.findById(squadId);

        if(!squad) {
            throw new BadRequestError('squad not found');
        }

        const members = await User.find({
            'email': {
                $in : membersEmails
            }
        });

        squad.set({
            members: members
        });


        await squad.save();
        return squad;
    }

    async removeMember(email: string, currentUserId: string) {
        const userToRemove = await User.findOne({email});

        if(!userToRemove) {
            throw new BadRequestError('user not found');
        }

        await Squad.updateOne({admin: currentUserId} , {
            $pullAll: {
                members: [{_id: userToRemove.id}]
            }
        });

        return await Squad.findOne({admin: currentUserId});
    }
}

const squadService = new SquadService();
export default squadService;