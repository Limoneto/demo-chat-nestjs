import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { MsgRepository } from 'src/msg/msg.repository';
import { UserRepository } from 'src/users/user.repository';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [UserRepository, MsgRepository,ChatRepository],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
