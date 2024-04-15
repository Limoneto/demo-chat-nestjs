import { HttpStatus, Injectable, Logger, Request } from '@nestjs/common';
import {SendMessageDto} from './dto/sendMessage.dto';
import { Chat } from './entities/chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ChatDocument } from './entities/chat.entity'; // Import the missing ChatResumeDocument type
import { Model } from 'mongoose';
import { User,UserDocument } from 'src/users/entities/user.entity';

import { ResponseDTO } from 'src/http/responses.interface';

import { ResponseHelper } from 'src/http/response.helper';
import { MsgChat } from '../msg/entities/msg.entity';
import { ChatDto } from './dto/chat.dto'; //
import { ChatRepository } from './chat.repository';
import { UserRepository } from 'src/users/user.repository';
import { MsgRepository } from 'src/msg/msg.repository';
import { MsgChatDTO } from 'src/msg/dto/msg.dto';

@Injectable()
export class ChatService {

private readonly logger = new Logger(ChatService.name);
constructor(
  private readonly chatRepository: ChatRepository,
  private readonly userRepository: UserRepository,
  private readonly msgRepository: MsgRepository,
  private readonly responseHelper : ResponseHelper
  
  
  ) {}
  
  async findAllMyChats(userId: any):Promise<ResponseDTO> {
    try {
     let chats = await this.chatRepository.findAllByUserIdAndPopulate(userId)
        if (!chats) {
          this.logger.log(`findAllMyChats - There are no chats for ${userId} \n ${Date.now()}`);
          return null;
        }

      const data = chats.map((chat) => { return new ChatDto(chat)});
      const response = this.responseHelper.makeResponse(false, 'Chats found',data, HttpStatus.OK);
      return response;
    } catch (e) {
      this.logger.log('findAllMyChats - Error \n' + Date.now() + '\n' + e);
      const response = this.responseHelper.makeResponse(true, 'Server Error',null, HttpStatus.INTERNAL_SERVER_ERROR);
      return response;
    }
  }


  async sendMessage(dto: SendMessageDto):Promise<ResponseDTO> {
    //PUEDE BORRARSE

    let userTO = await this.userRepository.findById(dto.toNick);
    let userFrom = await this.userRepository.findById(dto.fromNick);
    if(!userTO || !userFrom){
      this.logger.log('createChat - User not exists \n'+ Date.now()+'\n'+!userTO?dto.toNick:""+'\n'+!userFrom?dto.fromNick:"");
      const response = this.responseHelper.makeResponse(true, 'The user is not avaible',null, HttpStatus.NOT_FOUND);
      return response;
    }
    const newMessage = new MsgChat();
    newMessage.from = userFrom;
    newMessage.to = userTO;
    newMessage.message = dto.message;
    newMessage.dateTime = dto.dateTime;
    newMessage.data = dto.data;
    let msg = await this.msgRepository.createMsgChat(newMessage).then((msg) => { return msg}).catch((e) => {
      this.logger.log('sendMessage - Error creating message \n'+ Date.now()+'\n'+dto);
      return null;})
      if(!msg){
        const response = this.responseHelper.makeResponse(true, 'Error creating message',null, HttpStatus.INTERNAL_SERVER_ERROR);
        return response;
      }
    const array = [userTO.id,userFrom.id].sort(); // para que se guarde igual siempre 
    const users = new Set<string>(array);
    let chat = await this.chatRepository.addMessageToChatByUsers(users,msg.id).then((chat) => { return chat}).catch((e) => {
      this.logger.log('sendMessage - Error adding message to chat \n'+ Date.now()+'\n'+users+'\n'+msg);
      return null;}
      );

    if(chat){
      this.logger.log('createChat - Chat already exists \n'+ Date.now()+'\n'+chat);
      const data = {chat: new ChatDto(chat),
                    channels: userTO.getChannels(),
                    message: new MsgChatDTO(msg)};
      return this.responseHelper.makeResponse(false, 'Message Added Succesfuly',data, HttpStatus.OK);}

    return this.responseHelper.makeResponse(false, 'IDK',null, HttpStatus.INTERNAL_SERVER_ERROR);


  }



//   async getChat(users: string[]):Promise<ResponseDTO>{
//     try{
//       let userTO = await this.userModel.findOne({nick:users[0]}).exec().then((user) => { return new User(user)});
//       let userFrom = await this.userModel.findOne({nick:users[1]}).exec().then((user) => { return new User(user)});
//       if(!userTO || !userFrom){
//         this.logger.log('getChat - User not exists \n'+ Date.now()+'\n'+!userTO?users[0]:""+'\n'+!userFrom?users[1]:"");
//         const response = this.responseHelper.makeResponse(true, 'The user is not avaible',null, HttpStatus.NOT_FOUND);
//         return response;
//       }
//       let chat = await this.chatModel.findOne({users: users}).exec().then((chat) => {
//         if(!chat){
//           this.logger.log('getChat - Chat not exists \n'+ Date.now()+'\n'+users);
//           return null;
//         }
//       return chat;
//     });
//   }
//   catch(e){ }
// }


//   async XsendMessage(sendMessageDto: SendMessageDto):Promise<ResponseDTO> {
//     try {
//       let userTO = await this.userModel.findOne({nick:sendMessageDto.toNick}).exec().then((user) => { return new User(user)});
//       let userFrom = await this.userModel.findOne({nick:sendMessageDto.fromNick}).exec().then((user) => { return new User(user)});
//       if(!userTO || !userFrom){
//         this.logger.log('sendMessage - User not exists \n'+ Date.now()+'\n'+!userTO?sendMessageDto.toNick:""+'\n'+!userFrom?sendMessageDto.fromNick:"");
//         const response = this.responseHelper.makeResponse(true, 'The user is not avaible',null, HttpStatus.NOT_FOUND);
//         return response;
//       }
//       let chat = await this.chatModel.findOne({users: [userFrom.id,userTO.id]}).exec().then((chat) => {
//         if(!chat){
//           this.logger.log('sendMessage - Chat not exists \n'+ Date.now()+'\n'+sendMessageDto);
//           const response = this.responseHelper.makeResponse(true, 'The chat is not avaible',null, HttpStatus.NOT_FOUND);
//           return response;
//         }
//         return chat;
//       });
//       if(!chat){
//         const response = this.responseHelper.makeResponse(true, 'The chat is not avaible',null, HttpStatus.NOT_FOUND);
//         return response;
//       }
//       const msg = await this.msgModel.create({chat: chat.id,from: userFrom.id,to: userTO.id,message: sendMessageDto.message}).then((msg) => { return new MsgChat(msg)});
//       chat.messages.push(msg);
//       chat.save();
//       const response = this.responseHelper.makeResponse(false, 'Message sent',new MsgChat(msg), HttpStatus.OK);
//       return response;
//     } catch (e) {
//       this.logger.log('sendMessage - Error \n' + Date.now() + '\n' + e);
//       const response = this.responseHelper.makeResponse(true, 'Server Error',null, HttpStatus.INTERNAL_SERVER_ERROR);
//       return response;
//     }
//   }

//   async verifyUser(): Promise<UserDocument> {
//     // Add your code here
//     return null;
//   }


}
