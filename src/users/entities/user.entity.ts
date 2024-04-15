import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AbstractPassword } from 'src/Interfaces/IPassword.I';
import { Chat } from 'src/chat/entities/chat.entity';
import { Room } from 'src/room/entities/room.entity';

@Schema()
export class User extends AbstractPassword {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  private name: string;

  @Prop({ required: true })
  private surname: string;

  @Prop({ required: true, unique: true })
  private nick: string;

  @Prop({ required: true, unique:true })
  private mail: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }], default: [] })
  private chats: Chat[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }], default: [] })
  private groups: Room[];

  @Prop({ required: true, default: new Set<string>() })
  private channels: Set<string>;

  constructor() {
    super();
  }

  public fieldWithData(userDocument: UserDocument): void {
    this.id = userDocument.id;
    this.name = userDocument.name;
    this.surname = userDocument.surname;
    this.nick = userDocument.nick;
    this.password = userDocument.password;
    this.chats = userDocument.chats;
    this.groups = userDocument.groups;
    this.channels = userDocument.channels;
    this.mail = userDocument.mail;
  }
  

  getName(): string {
    return this.name;
  }

  getSurname(): string {
    return this.surname;
  }

  getNick(): string {
    return this.nick;
  }

  getMail(): string {
    return this.mail;
  }

  getChats(): Chat[] {
    return this.chats;
  }

  getGroups(): Room[] {
    return this.groups;
  }

  getChannels(): Set<string> {
    return this.channels;
  }

  

  setName(name: string): void {
    this.name = name;
  }

  setSurname(surname: string): void {
    this.surname = surname;
  }

  setNick(nick: string): void {
    this.nick = nick;
  }

  setMail(mail: string): void {
    this.mail = mail;
  }

  setChats(chats: Chat[]): void {
    this.chats = chats;
  }

  setGroups(groups: Room[]): void {
    this.groups = groups;
  }

  setChannels(channels: Set<string>): void {
    this.channels = channels;
  }
}


export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
