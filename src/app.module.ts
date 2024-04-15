import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomModule } from './room/room.module';
import { ChatModule } from './chat/chat.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AuthModule, UsersModule, RoomModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }],
})
export class AppModule {}

