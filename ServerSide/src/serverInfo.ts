import path from "path";
import fs from "fs";

 //As classes  IMAP e SMTP estarão em contacto com servidores. Como tal, é necessário disponibilizar
//as informações do server para elas. Essas informações estão alocadas em: server/serverInfo.json.

//Exporta uma interface que replicará o ficheiro server/serverInfo.json. Nessa interface, guardará variáveis
//que guardarão objetos inerentes à interface ???e que será o conteúdo a transmitir???.
export interface IServerInfo { 
    smtp: {
        host: string, 
        port: number, 
        auth: {user: string, pass: string}
    }
}

export let serverInfo: IServerInfo;

//Lê a informação em server/serverInfo.json e inicializa a variável acima criada.
//É aqui que a informação em server/serverInfo.json será lida e copiada para uma variável da interface que criámos.
//fs.readFileSync() - its a interface of fs module which is used to read the file and return its content
//faz-se readFileSync pois e uma acao em que o programa so pode continuar depois de concluir, neste caso o login
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../server/serverInfo.json"),'utf8');
//JSON.parse() - method parses a JSON string, constructing the JavaScript value or object described by the string
serverInfo = JSON.parse(rawInfo); // string to object
