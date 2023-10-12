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

    async create(squad: SquadRequestAttrs): Promise<SquadDocument | null> {
        const adminUser = await User.findOne({id: squad.currentUserId}) as UserDocument;

        const squadFromDb = await Squad.findOne({name: squad.name});
        if(squadFromDb) {
            throw new BadRequestError(' squad name is already in use ');
        }

        const newSquad = Squad.build({
            name: squad.name,
            description: squad.description,
            location: squad.location,
            admin: adminUser
        });
        await newSquad.save();
        return newSquad;
    }
    
    async addMembersToSquad(membersEmails: string[], squadId: string) {
        const members = await User.find({
            'email': {
                $in : membersEmails
            }
        });

        const squad = await Squad.findById(squadId);

        if(!squad) {
            throw new NotFoundError();
        }

        squad.set({
            members: members
        })

        await squad.save();

        return squad;
    }

}

const squadService = new SquadService();
export default squadService;