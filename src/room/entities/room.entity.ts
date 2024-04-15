import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'firebase/auth';
import mongoose, { Document } from 'mongoose';
import { AbstractPassword } from 'src/Interfaces/IPassword.I';
import {  MsgRoom } from 'src/msg/entities/msg.entity';
export type RoomDocument = Room & Document;

@Schema()
export class Room extends AbstractPassword {

  @Prop({required: true, unique: true}) 
  id: string;

  @Prop() 
  descripcion: string;

  @Prop({required: true, unique: true}) 
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  owner: User;

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MsgRoom' }] })
  messages: MsgRoom[];

  @Prop({required: true,default: false})
  isOpen: boolean;

  @Prop({required: true, unique: true})
  channelId: string;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: Set<User>;

  constructor(roomDocument: RoomDocument){
    super();
    this.descripcion = roomDocument.descripcion;
    this.name = roomDocument.name;
    this.password = roomDocument.password;
    this.owner = roomDocument.owner;
    this.messages = roomDocument.messages;
    this.isOpen = roomDocument.isOpen;
    this.channelId = roomDocument.channelId;
    this.id = roomDocument.id;
  }

}

export const RoomSchema = SchemaFactory.createForClass(Room);