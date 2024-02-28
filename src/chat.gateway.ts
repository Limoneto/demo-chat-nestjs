import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Channel {
  name: string;
  owner: string;
  users: Set<string>;
  messages: Array<{ user: string; text: string }>;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly clients: Map<string, Set<string>> = new Map();
  private readonly channels: Map<string, Channel> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    client.emit('serverMessage', `Bienvenido, tu ID es ${client.id}`);
  }

  @SubscribeMessage('createChannel')
  handleCreateChannel(client: Socket, channelName: string): void {
    if (!this.channels.has(channelName)) {
      const owner = client.id;
      const newChannel: Channel = {
        name: channelName,
        owner,
        users: new Set([owner]),
        messages: [],
      };
      this.channels.set(channelName, newChannel);

      client.join(channelName);
      this.clients.set(client.id, new Set([channelName]));

      client.emit('channelCreated', `Has creado el canal: ${channelName}`);
    } else {
      client.emit('channelExists', `El canal ${channelName} ya existe`);
    }
  }

  @SubscribeMessage('joinChannelRequest')
  handleJoinChannelRequest(client: Socket, { channelName, requesterId }: { channelName: string; requesterId: string }): void {
    const channel = this.channels.get(channelName);
    if (channel && channel.owner !== client.id) {
      // Envía una solicitud al dueño del canal
      this.server.to(channel.owner).emit('joinChannelRequest', {
        requesterId,
        channelName,
        requesterName: client.id, // Puedes enviar más información sobre el solicitante si es necesario
      });
    }
  }

  @SubscribeMessage('acceptJoinRequest')
  handleAcceptJoinRequest(client: Socket, { channelName, requesterId }: { channelName: string; requesterId: string }): void {
    const channel = this.channels.get(channelName);
    if (channel && channel.owner === client.id) {
      const requester = this.server.sockets.sockets.get(requesterId);
      if (requester) {
        requester.join(channelName);
        channel.users.add(requesterId);
        this.clients.get(requesterId)?.add(channelName);

        this.server.to(channelName).emit('userJoined', `${requesterId} se ha unido al canal`);
        requester.emit('joinedChannel', `Te has unido al canal: ${channelName}`);
      }
    }
  }

  @SubscribeMessage('rejectJoinRequest')
  handleRejectJoinRequest(client: Socket, { channelName, requesterId }: { channelName: string; requesterId: string }): void {
    // Puedes personalizar el mensaje de rechazo según tus necesidades
    const rejectionMessage = `La solicitud para unirse al canal ${channelName} ha sido rechazada.`;
    this.server.to(requesterId).emit('joinRequestRejected', rejectionMessage);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, { channelName, text, from }: { channelName: string; text: string ; from: string }): void {
    const channel = this.channels.get(channelName);
    const message = { user: client.id, text , from};
    if(!channel){
      this.server.to(channelName).emit('newMessage', message);
    }
    if (channel && channel.users.has(client.id)) {
      channel.messages.push(message);
      this.server.to(channelName).emit('newRoomMessage', message);
    }
    else{
      this.server.to(client.id).emit('serverMessage', `No estas autorizado a enviar mensajes al room ${channelName}`);
    }
  }

  @SubscribeMessage('removeUserFromChannel')
  handleRemoveUserFromChannel(client: Socket, { channelName, userId }: { channelName: string; userId: string }): void {
    const channel = this.channels.get(channelName);
    if (channel && channel.owner === client.id && channel.users.has(userId)) {
      const userSocket = this.server.sockets.sockets.get(userId);
      if (userSocket) {
        userSocket.leave(channelName);
        channel.users.delete(userId);
        this.clients.get(userId)?.delete(channelName);

        this.server.to(channelName).emit('userLeft', `${userId} ha sido removido del canal por el dueño`);
        userSocket.emit('removedFromChannel', `Has sido removido del canal ${channelName} por el dueño`);
      }
    }
  }

  @SubscribeMessage('broadcastMessage')
  handleBroadcastMessage(client: Socket, text: string): void {
    const senderName = client.id;
    this.server.emit('broadcast', `${senderName} dice: ${text}`);
  }

  handleDisconnect(client: Socket) {
    const userChannels = this.clients.get(client.id);
    if (userChannels) {
      userChannels.forEach((channelName) => {
        const channel = this.channels.get(channelName);
        if (channel) {
          channel.users.delete(client.id);
          this.server.to(channelName).emit('userLeft', `${client.id} ha abandonado el canal`);
          if(channel.owner == client.id){
            channel.owner = Array.from(channel.users)[0]||"";
            if (channel.owner==""){
              this.channels.delete(channelName);
            }
          }
        }
      });
      this.clients.delete(client.id);
    }
  }
}
