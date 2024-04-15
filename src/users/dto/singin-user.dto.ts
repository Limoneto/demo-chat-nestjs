export class  LoginDTO {
    email:string;
    nick: string;
    password: string;

    constructor(nick: string, password: string, email:string) {
        this.nick = nick;
        this.password = password;
        this.email=email;
    }
}