"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
//Lê a informação em server/serverInfo.json e inicializa a variável acima criada.
//É aqui que a informação em server/serverInfo.json será lida e copiada para uma variável da interface que criámos.
//fs.readFileSync() - its a interface of fs module which is used to read the file and return its content
//faz-se readFileSync pois e uma acao em que o programa so pode continuar depois de concluir, neste caso o login
const rawInfo = fs_1.default.readFileSync(path_1.default.join(__dirname, "../server/serverInfo.json"), 'utf8');
//JSON.parse() - method parses a JSON string, constructing the JavaScript value or object described by the string
exports.serverInfo = JSON.parse(rawInfo); // string to object
