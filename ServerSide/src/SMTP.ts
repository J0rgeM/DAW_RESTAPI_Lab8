//imports relacionados com o nodemailer
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

//importa as informações do server
import { IServerInfo } from "./serverInfo";

//A class worker recebe um objeto do tipo IServerInfo e o guarda numa variável privada. Contem também o método sendMessage.
export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo; // informação relativa ao server é instaciada
    }
    //sendMessage() - envia a mensagem em forma asincrona, que requer um objeto que pertece à interface SendMailOptions
    public sendMessage(inOptions: SendMailOptions): Promise<void> {
        return new Promise((inResolve, inReject) => {
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            //transport.sendMail() - utiliza o transportador para fazer o envio do email
            transport.sendMail(inOptions,
                (inError: Error | null, inInfo: SentMessageInfo) => {
                    if (inError) {
                        //inReject() - The returned promise will be rejected with that argument
                        inReject(inError);
                    } else {
                        //inResolve() - called with a non-promise value then the promise is fulfilled with that value. If it is called with a promise (A) then the returned promise takes on the state of that new promise (A)
                        inResolve();
                    }
                }
            );
        });
    }
}
