import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { MsgChat } from '../../msg/entities/msg.entity';
export type ChatDocument = Chat & Document;
@Schema()
export class Chat {
    @Prop({ required: true, unique: true})
    id: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default:new Set<User>() })
    users: Set<User>;
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MsgChat' }], default: new Set<User>() })
    messages: MsgChat[];

    constructor(obj?: Partial<Chat>) {
        this.id = obj?.id;
        this.users = obj?.users;
        this.messages = obj?.messages;
    }
}
export const ChatSchema = SchemaFactory.createForClass(Chat);

