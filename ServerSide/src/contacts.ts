import * as path from "path";
const Datastore = require("nedb");

//IContact é uma interface que descreve um contacto e que é necessária para adicionar, listar e eleiminar operações de contactos.
//Quando se adiciona um contacto, caso não seja identificado um id, o NeDB irá associar um id automaticamente.
export interface IContact {
    _id?: number,
    name: string,
    email: string
}


// Um objeto do tipo NeDB Datastore, que será criado, bem como o path para a contacts.db.
// A Nedb carrega o ficheiro aotumaticamente caso ainda não exista é criado.
export class Worker {
    private db: Nedb;
    constructor() { 
        this.db = new Datastore({
            filename: path.join(__dirname, " contacts .db"),
            autoload: true
        });
    }

    // Tal como o nodemail o NeDB nao providencia uma API com bases async/await, como tal teremos de o envolver numa promise
    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find({}, // é chamado dentro da promise o método find() na DataStore no qual o resultado que será retornado
                             // é o de todos e os dados em cantacts.db (que reresenta todos os contactos)
                (inError: Error | null, inDocs: IContact[]) => { // visto que sabe,os que os objetos que serao retornados sao do tipo IContact podemos usar como argumento o inDcos
                    if (inError) { // e tal como no nodemailer ou rejetamos a promise ou retornamos um array de documentos que contem os nossos objetos
                        inReject(inError);
                    } else {
                        inResolve(inDocs);
                    }
                }
            );
        });

    }

    public addContact(inContact: IContact): Promise<IContact> { // inContact como primeiro argumento
        return new Promise((inResolve, inReject) => { // este método passa o objeto adicionaodo para a callback que irºa possuir um campo _id, sendo esse obejto rentornado caller e ao client, de maneira a aparecer no ecrã
            this.db.insert(inContact,
                (inError: Error | null, inNewDoc: IContact) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inNewDoc);
                    }
                }
            );
        });
    }
    
    public deleteContact(inID: string): Promise<void> {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, //  este método recebe o _id do contacto e é necessário que exista um contacto com esse _id-
                (inError: Error | null, inNumRemoved: number) => { // como a callback representa  o número de contactos removidos, à partida será sempre 1
                                                                    // entap desde que a promise nao seja rejeitada, o contacto seá sempre removido com sucesso
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });
    }
}