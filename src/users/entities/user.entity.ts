import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Chat } from 'src/chat/entities/chat.entity';
import { Room } from 'src/room/entities/room.entity';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({required: true}) 
  name: string;

  @Prop({required: true}) 
  surname: string;
  
  @Prop({required: true, unique: true})
  nick: string;

  @Prop({required: true, default: false})
  password: string;

  @Prop({ required: true, default: []})
  chats: Chat[];

  @Prop({ required: true, default: []})
  groups: Room[];

}

export const UserSchema = SchemaFactory.createForClass(User);