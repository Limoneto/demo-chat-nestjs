import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user.schema';
import { Msg } from './msg.entity';
export type ChatDocument = Chat & Document;
@Schema()
export class Chat {
    @Prop({ required: true })
    users: User[];
    @Prop({ required: true, default: []})
    messages: Msg[];
    constructor(users: User[], messages: Msg[]){
        this.users = users;
        this.messages = messages;
    }
}
export const ChatSchema = SchemaFactory.createForClass(Chat);

