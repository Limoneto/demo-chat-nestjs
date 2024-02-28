import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Room } from 'src/room/entities/room.entity';
import { Chat } from 'src/chat/entities/chat.entity';
export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({required: true}) 
  lastname: string;

  @Prop({required: true}) 
  name: string;

  @Prop({unique:true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true, default: true})
  validated: string;

  @Prop({required: true, default: []})
  groups: Room[];

  @Prop({required: true, default: []})
  chats: Chat[];

  @Prop({required: true, default: []})
  channelIds: string[];

  @Prop({required: true})
  nick: string;

  constructor(
    lastname: string,
    name: string,
    email: string,
    password: string,
    validated: string,
    groups: Room[],
    chats: Chat[],
    channelIds: string[],
    nick: string,
  ) {
    this.lastname = lastname;
    this.name = name;
    this.email = email;
    this.password = password;
    this.validated = validated;
    this.groups = groups;
    this.chats = chats;
    this.channelIds = channelIds;
    this.nick = nick;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);