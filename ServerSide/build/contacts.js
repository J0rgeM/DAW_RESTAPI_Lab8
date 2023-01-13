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
const path = __importStar(require("path"));
const Datastore = require("nedb");
// Um objeto do tipo NeDB Datastore, que será criado, bem como o path para a contacts.db.
// A Nedb carrega o ficheiro aotumaticamente caso ainda não exista é criado.
class Worker {
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, " contacts .db"),
            autoload: true
        });
    }
    // Tal como o nodemail o NeDB nao providencia uma API com bases async/await, como tal teremos de o envolver numa promise
    listContacts() {
        return new Promise((inResolve, inReject) => {
            this.db.find({}, // é chamado dentro da promise o método find() na DataStore no qual o resultado que será retornado
            // é o de todos e os dados em cantacts.db (que reresenta todos os contactos)
            (inError, inDocs) => {
                if (inError) { // e tal como no nodemailer ou rejetamos a promise ou retornamos um array de documentos que contem os nossos objetos
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    }
    addContact(inContact) {
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContact, (inError, inNewDoc) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inNewDoc);
                }
            });
        });
    }
    deleteContact(inID) {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, //  este método recebe o _id do contacto e é necessário que exista um contacto com esse _id-
            (inError, inNumRemoved) => {
                // entap desde que a promise nao seja rejeitada, o contacto seá sempre removido com sucesso
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve();
                }
            });
        });
    }
}
exports.Worker = Worker;
