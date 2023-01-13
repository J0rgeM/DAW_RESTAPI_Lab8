"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
//imports relacionados com o nodemailer
const nodemailer = __importStar(require("nodemailer"));
//A class worker recebe um objeto do tipo IServerInfo e o guarda numa variável privada. Contem também o método sendMessage.
class Worker {
    constructor(inServerInfo) {
        Worker.serverInfo = inServerInfo; // informação relativa ao server é instaciada
    }
    //sendMessage() - envia a mensagem em forma asincrona, que requer um objeto que pertece à interface SendMailOptions
    sendMessage(inOptions) {
        return new Promise((inResolve, inReject) => {
            const transport = nodemailer.createTransport(Worker.serverInfo.smtp);
            //transport.sendMail() - utiliza o transportador para fazer o envio do email
            transport.sendMail(inOptions, (inError, inInfo) => {
                if (inError) {
                    //inReject() - The returned promise will be rejected with that argument
                    inReject(inError);
                }
                else {
                    //inResolve() - called with a non-promise value then the promise is fulfilled with that value. If it is called with a promise (A) then the returned promise takes on the state of that new promise (A)
                    inResolve();
                }
            });
        });
    }
}
exports.Worker = Worker;
