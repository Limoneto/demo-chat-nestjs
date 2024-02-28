import { Injectable, Logger } from '@nestjs/common';
import SendMessageDto from './dto/sendMessage.dto';
import { Chat } from './entities/chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ChatDocument } from './entities/chat.entity'; // Import the missing ChatResumeDocument type
import { Model } from 'mongoose';
import { User } from 'src/user.schema';


@Injectable()
export class ChatService {

  private readonly logger = new Logger(ChatService.name);


  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>) {}

  async createChat(users: User[]) {
      let chat = await this.chatModel.findOne({users: users}).exec().then((chat) => {
        if(chat){
          this.logger.log('createChat - Chat already exists \n'+ Date.now()+'\n'+chat);
          return chat;
        }
        return this.chatModel.create({users});
      });
      return chat;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async getChat(users: string[]) {
    let chat = await this.chatModel.findOne({users: users}).exec().then((chat) => {
      if(!chat){
        this.logger.log('getChat - Chat not exists \n'+ Date.now()+'\n'+users);
        return null;
      }
      return chat;
    });
    return chat;
  }
}
