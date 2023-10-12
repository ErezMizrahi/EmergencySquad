import { NotFoundError } from "../errors/notFound.error";
import { Squad, SquadAttrs, SquadDocument } from "../models/squad.model";
import { User } from "../models/user.model";

class SquadService {

    async create(squad: SquadAttrs): Promise<SquadDocument | null> {
        const newSquad = Squad.build(squad);
        await newSquad.save();
        return newSquad;
    }
    
    async addMembersToSquad(membersEmails: string[], squadId: string) {
        const members = await User.updateMany({
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