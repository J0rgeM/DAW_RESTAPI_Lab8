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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importação de módulos
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
//Importação de módulos de aplicação
const serverInfo_1 = require("./serverInfo");
const SMTP = __importStar(require("./SMTP"));
const Contacts = __importStar(require("./contacts"));
//Criação de uma express APP, assim como, de uma middleware que a torne útil
//app.use() function is used to mount the specified middleware function(s) at the path which is being specified
//adiciona middleware/funcionalidades, neste caso adiciona a funcao json() ao express
const app = (0, express_1.default)();
app.use(express_1.default.json());
//CORS é um mecanismo de segurança presente nos browsers que garante que apenas certos dominios possam ser chamandos nos servissos REST.
//endpoint "/"
//express.static() - serve para fornecer os recursos estaticos (html, images, CSS files, and JavaScript files, etc.)
//path.join() - junta os dois argumentos e poe normal o resultado do caminho para irmos buscar um ficheiro estatico a nossa maquina
//__dirname - e o caminho da pasta atual
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../ClientSide/dist")));
//esta funcao adiciona os headers necessarios a resposta
//inNext() - passa a proxima funcao que esta em stack do middleware
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    inNext();
});
//Registro do path e método para o endpoint utilizado para enviar mensagens, sendo que o path é /messages
//app.post() function routes the HTTP POST requests to the specified path with the specified callback functions
app.post("/messages", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const smtpWorker = new SMTP.Worker(serverInfo_1.serverInfo);
        yield smtpWorker.sendMessage(inRequest.body); // object created by express . jsonmiddleware
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
//Registro do path e do method para o endpoint que é utilizado para obter a lista de contactos.
//app.get() - Routes HTTP GET requests to the specified path with the specified callback functions
app.get("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contacts = yield contactsWorker.listContacts();
        inResponse.json(contacts); // serialize object into JSON
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
//Registro do path e do method para o endpoint que é utilizado para adicionar um contacto à lista de contactos.
app.post("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contact = yield contactsWorker.addContact(inRequest.body);
        inResponse.json(contact); // for client acknowledgment and future use ( includesID)
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
//Registro do path e do method para o endpoint que é utilizado para eliminar um contacto em especifico.
app.delete("/contacts/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        yield contactsWorker.deleteContact(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
app.listen(8080);
