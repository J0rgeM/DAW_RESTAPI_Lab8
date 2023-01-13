//Importação de módulos
import path from "path";
import express,{Express, NextFunction, Request, Response } from "express";

//Importação de módulos de aplicação
import {serverInfo} from "./serverInfo";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import {IContact} from "./contacts";

//Criação de uma express APP, assim como, de uma middleware que a torne útil

//app.use() function is used to mount the specified middleware function(s) at the path which is being specified
//adiciona middleware/funcionalidades, neste caso adiciona a funcao json() ao express
const app : Express = express() ;
app.use(express.json());

//CORS é um mecanismo de segurança presente nos browsers que garante que apenas certos dominios possam ser chamandos nos servissos REST.

//endpoint "/"
//express.static() - serve para fornecer os recursos estaticos (html, images, CSS files, and JavaScript files, etc.)
//path.join() - junta os dois argumentos e poe normal o resultado do caminho para irmos buscar um ficheiro estatico a nossa maquina
//__dirname - e o caminho da pasta atual
app.use("/", express.static(path.join (__dirname, "../../ClientSide/dist")));

//esta funcao adiciona os headers necessarios a resposta
//inNext() - passa a proxima funcao que esta em stack do middleware
app.use(function(inRequest: Request, inResponse: Response, inNext : NextFunction ) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    inNext();
});

//Registro do path e método para o endpoint utilizado para enviar mensagens, sendo que o path é /messages
//app.post() function routes the HTTP POST requests to the specified path with the specified callback functions
app.post("/messages", async ( inRequest : Request , inResponse : Response ) => {
    try {
        const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo) ;
        await smtpWorker.sendMessage(inRequest.body); // object created by express . jsonmiddleware
        inResponse.send("ok");
    } catch (inError) {
        inResponse.send("error") ;
    }
});

//Registro do path e do method para o endpoint que é utilizado para obter a lista de contactos.
//app.get() - Routes HTTP GET requests to the specified path with the specified callback functions
app.get("/contacts", async (inRequest: Request ,inResponse: Response ) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contacts: IContact[] = await contactsWorker.listContacts();
        inResponse.json(contacts); // serialize object into JSON
    } catch (inError) {
        inResponse.send ("error") ;
    }
});

//Registro do path e do method para o endpoint que é utilizado para adicionar um contacto à lista de contactos.
app.post("/contacts", async (inRequest: Request ,inResponse: Response ) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: IContact = await contactsWorker.addContact(inRequest.body);
        inResponse.json(contact); // for client acknowledgment and future use ( includesID)
    } catch (inError) {
        inResponse.send("error") ;
    }
});

//Registro do path e do method para o endpoint que é utilizado para eliminar um contacto em especifico.
app.delete("/contacts/:id", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        await contactsWorker.deleteContact(inRequest.params.id);
        inResponse.send("ok");
    } catch ( inError ) {
        inResponse.send("error") ;
    }
});

app.listen(8080);