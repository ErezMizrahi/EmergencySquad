import {model, Schema, Model, Document } from "mongoose";
import { UserDocument } from "./user.model";

//interface that desribe the props to create a new user 
export interface SquadAttrs { 
    name: string;
    location: string;
    description: string;
    admin: UserDocument;
    members? : UserDocument[];
}

//an interface that desbribe the props that a model has
interface SquadModel extends Model<SquadDocument> {
    build(attrs: SquadAttrs): SquadDocument
}

// interface that describe the props that a document has
export interface SquadDocument extends Document{ 
    name: string;
    location: string;
    description: string;
    admin: UserDocument;
    members? : UserDocument[];
}

const squadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {
    // timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    },
    versionKey: false
});

squadSchema.statics.build = (attrs: SquadAttrs) => {
    return new Squad(attrs);
}

const Squad = model<SquadDocument, SquadModel>('squad', squadSchema);

export { Squad };