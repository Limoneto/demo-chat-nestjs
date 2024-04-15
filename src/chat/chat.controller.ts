import { ChatService } from './chat.service';
import {SendMessageDto} from './dto/sendMessage.dto';
import { UsersService } from 'src/users/users.service';
import { Msg } from '../msg/entities/msg.entity';
import { User } from 'src/users/entities/user.entity';
import { Body, Controller, Get, Logger, Request } from '@nestjs/common';
import { log } from 'console';
import {
  SubscribeMessage,
  MessageBody
} from '@nestjs/websockets';
import getChatDto from './dto/getChat.dto';

@Controller('chat')
export class ChatController {
  
  private readonly logger = new Logger(ChatController.name);
  
  constructor(private readonly chatService: ChatService) {}
  
  

  @Get('getMyChats')
  async findAll(@Request() req){
    return this.chatService.findAllMyChats(req);
  }

  @SubscribeMessage('findOneChat')
  async findOne(@MessageBody() getChatDto: getChatDto) {
    
    const usersTo = await this.userService.findOne(getChatDto.toNick).then((user)=>{return new User().fieldWithData(user);}); 
    const usersFrom = await this.userService.findOne(getChatDto.fromNick).then((user)=>{return new User().fieldWithData(user);});
    const users = [usersTo, usersFrom];
    const chatsDoc = this.chatService.findChat(users);

    // return

  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
