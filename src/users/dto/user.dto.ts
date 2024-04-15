import { UserDocument } from "../entities/user.entity";

export class UserDTO {
    id: number;
    name: string;
    surname : string;
    nick: string;


    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.nick = user.nick;
    }

}