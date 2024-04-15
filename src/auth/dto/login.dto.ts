export class  LoginDTO {
    nick: string;
    password: string;

    constructor(nick: string, password: string) {
        this.nick = nick;
        this.password = password;
    }
}