import { ChatService } from './chat.service';
import SendMessageDto from './dto/sendMessage.dto';
import { UsersService } from 'src/users/users.service';
import { Msg } from './entities/msg.entity';
import { User } from 'src/user.schema';
import { Logger } from '@nestjs/common';
import { log } from 'console';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import connectionDTO  from './dto/connection.dto';

@WebSocketGateway(81)
export class ChatGateway {
  
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() private readonly server: Server;
  constructor(private readonly chatService: ChatService,
    private readonly userService: UsersService) {}
    
    handleConnection(client: Socket, connectionDTO: connectionDTO) {
      const user = this.userService.findOne(connectionDTO.nick).then((user) => {
        user.channelIds.push(client.id);
        user.save();
      });
      client.emit('welcome', `Bienvenido, tu ID es ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async create(@MessageBody() sendmsgDto: SendMessageDto) {
    try{
    let { fromNick, message, data, dateTime, toNick } = sendmsgDto;
    let userFrom = await this.userService.findOne(fromNick); 
    let userTo = await this.userService.findOne(toNick); 
    let usersDoc = [userFrom, userTo];
    let users = usersDoc.map((user) => new User(user.lastname, user.nick, user.name,  user.email, user.password, user.validated, user.groups, user.chats, user.channelIds));
    let chat = await this.chatService.createChat(users); 
    const msg = new Msg();
    msg.from = users[0];
    msg.message = message;
    msg.data = data;
    msg.dateTime = dateTime ? dateTime : new Date();
    msg.to = users[1];
    chat.messages.push(msg);
    chat.users.concat(users);
    chat.save();

  }
    catch(e){
      this.logger.log('sendMessage - Error \n'+ Date.now()+'\n'+e);
  }
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
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
