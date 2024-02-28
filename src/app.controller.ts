import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getIndex(){}

  @Get('/room/:roomID/:clientID')
  @Render('room')
  getRooms(@Param('roomID') roomID: string, @Param('clientID') clientID: string): { roomID: string, clientID: string } {
    return { roomID, clientID };
  }

}
