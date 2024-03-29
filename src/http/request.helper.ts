import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
//import jwtDecode from 'jwt-decode';  // TODO: Uncomment this line after installing the jwt-decode package
// TODO: USAR JWT Y GUARDS

interface ComviHeader extends IncomingHttpHeaders {
  authorization ?: string;
}

interface UserPayload {
    id?: string;
    name?: string,
    email?: string;
}

interface Payload {
    user?: UserPayload
    iat?: number,
    exp?: number
}

@Injectable()
export class RequestHelper {

  constructor() {}

  getPayload = (request : Request) : string  => {
    try {
      let auth;
      let token;
      let email: string = '';

      const req : Request = request;
      const head : ComviHeader = req.headers;

      if(head.authorization){
        auth = head.authorization;
        token = auth.split(' ')[1];
        // const payload : Payload = jwtDecode(token);
        // email = payload.user.email;
      }

      return email;
    } catch (error) {
      console.error(error);
    }
  }
}

