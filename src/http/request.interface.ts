import { HttpStatus } from "@nestjs/common";


export interface IRequestDTO {
}
export interface reuqestDTO {
  sessionId: string;
  jwt: string;
  data: IRequestDTO;
}