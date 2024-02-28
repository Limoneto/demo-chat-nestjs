import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Msg } from 'src/chat/entities/msg.entity';
import { User } from 'src/user.schema';
export type RoomDocument = Room & Document;

@Schema()
export class Room {

  @Prop() 
  descripcion: string;

  @Prop({required: true, unique: true}) 
  name: string;

  @Prop({required: true, default: false})
  password: string;

  @Prop({required: true})
  owner: User;

  @Prop({ required: true, default: []})
  messages: Msg[];

  @Prop({required: true,default: false})
  isOpen: boolean;

  @Prop({required: true, unique: true})
  channelId: string;

  constructor(descripcion: string, name: string, id: string, password: string, owner: User, messages: Msg[], isOpen: boolean, channelId: string){
    this.descripcion = descripcion;
    this.name = name;
    this.id = id;
    this.password = password;
    this.owner = owner;
    this.messages = messages;
    this.isOpen = isOpen;
    this.channelId = channelId;
  }

}

export const RoomSchema = SchemaFactory.createForClass(Room);