import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
export type MsgChatDocument = MsgChat & Document;
export type MsgRoomDocument = MsgRoom & Document;
export type MsgDocument = Msg & Document;
@Schema()
export class Msg {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    from: User;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    data: any;

    @Prop({ required: true, default: new Date() })
    dateTime: Date;
}
export const MsgSchema = SchemaFactory.createForClass(Msg);


@Schema()
export class MsgChat extends Msg {

    @Prop({ required: true , type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    to: User;
}
export const MsgChatSchema = SchemaFactory.createForClass(MsgChat);

@Schema()
export class MsgRoom {

    @Prop({ required: true , type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
    to: Room;
}
export const MsgRoomSchema = SchemaFactory.createForClass(MsgRoom);

