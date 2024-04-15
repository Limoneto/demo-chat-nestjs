import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Room } from 'src/room/entities/room.entity';
import { UsersService } from 'src/users/users.service'; // Import the missing UserService class
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ResponseDTO } from 'src/http/responses.interface';
import { SendMessageDto } from './dto/sendmessage.dto'; // Import the missing sendMessageDto type
import { ResponseHelper } from 'src/http/response.helper';


@WebSocketGateway(3001, { namespace: '/chatSocket' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly clients: Map<string, Set<string>> = new Map();
  private readonly channels: Map<string, Room> = new Map();
  private readonly responseHelper : ResponseHelper;
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService // Ensure that the parameter name matches the imported class name
  ) {}
  
  @UseGuards(AuthGuard)
  async handleConnection(client: Socket, req: Request) {
    this.userService.handleConnection(client.id, req['sub']);
    client.emit('serverMessage', `Bienvenido, tu canal es ${client.id}`);
  }
  
  @UseGuards(AuthGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, dto: SendMessageDto): Promise<ResponseDTO> { // Use the sendMessageDto type as the parameter type
      const response = this.chatService.sendMessage(dto).then((res) => {
        const chat = res.data?.chat;
        const channels = res.data?.channels;
        const msg = res.data?.message;
        if (channels) {
          channels.forEach((channel) => {
            this.server.to(channel).emit('newMessage', msg);
          });
          client.emit('sendMessage-response', response);
          return response;
        }
      }); 
      return response;
    }
  

  // @SubscribeMessage('acceptJoinRequest')
  // handleAcceptJoinRequest(client: Socket, { channelName, requesterId }: { channelName: string; requesterId: string }): void {
  //   const channel = this.channels.get(channelName);
  //   if (channel && channel.owner === client.id) {
  //     const requester = this.server.sockets.sockets.get(requesterId);
  //     if (requester) {
  //       requester.join(channelName);
  //       channel.users.add(requesterId);
  //       this.clients.get(requesterId)?.add(channelName);

  //       this.server.to(channelName).emit('userJoined', `${requesterId} se ha unido al canal`);
  //       requester.emit('joinedChannel', `Te has unido al canal: ${channelName}`);
  //     }
  //   }
  // }

  @SubscribeMessage('rejectJoinRequest')
  handleRejectJoinRequest(client: Socket, { channelName, requesterId }: { channelName: string; requesterId: string }): void {
    // Puedes personalizar el mensaje de rechazo según tus necesidades
    const rejectionMessage = `La solicitud para unirse al canal ${channelName} ha sido rechazada.`;
    this.server.to(requesterId).emit('joinRequestRejected', rejectionMessage);
  }

  
  @SubscribeMessage('broadcastMessage')
  handleBroadcastMessage(client: Socket, text: string, req: Request): void {
    const senderName = client.id;
    this.server.emit('broadcast', `${senderName} dice: ${text}`);
  }

  // @UseGuards(AuthGuard)
  // handleDisconnect(client: Socket) {
  //   const userChannels = this.clients.get(client.id);
  //   if (userChannels) {
  //     userChannels.forEach((channelName) => {
  //       const channel = this.channels.get(channelName);
  //       if (channel) {
  //         channel.users.delete(client.id);
  //         this.server.to(channelName).emit('userLeft', `${client.id} ha abandonado el canal`);
  //         if(channel.owner == client.id){
  //           channel.owner = Array.from(channel.users)[0]||"";
  //           if (channel.owner==""){
  //             this.channels.delete(channelName);
  //           }
  //         }
  //       }
  //     });
  //     this.clients.delete(client.id);
  //   }
  // }

  afterInit() {
    // Code to be executed when the gateway is initialized
    console.log('Gateway initialized');
  }

  @UseGuards(AuthGuard)
  async handleDisconnect(client: Socket) {
    const userID = this.clients.get(client.id);
    const flag = await this.userService.handleDisconnetion(client.id);
    if (flag) {
      this.clients.delete(client.id);
    }
  }

  
}


// toDo: 
// 1. EMPEZAR A TESTEAR
// 2. REVISAR QUE TODO FUNCIONE
// 3. AGREGAR ROOMS

