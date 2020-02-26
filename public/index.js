"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = __importDefault(require("./src/api/note/note"));
var file_1 = __importDefault(require("./src/api/file/file"));
var _a = require('apollo-server-express'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var buildFederatedSchema = require('@apollo/federation').buildFederatedSchema;
var file_2 = require("./src/api/file/file");
var express_1 = __importDefault(require("express"));
var mysql = require('mysql');
var user_1 = __importDefault(require("./src/api/user/user"));
var User = new user_1.default();
var cors = require('cors');
var sqlinjection = require('sql-injection');
exports.mysqlConnection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'example',
    database: 'taxDB'
});
var typeDefs = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\ttype Query {\n\t\tvalidateUser(username:String, password:String):User\n\t\tgetNotes(FK_Mongo_Case:String):[Note]\n\t\tgetFiles(FK_Mongo_Case:String):[File]\n\t}\n\ttype Mutation{\n\t\taddNote(messenge:String,FK_User:Int,FK_Mongo_Case:String):String\n\t\tdeleteNote(ID:Int):Boolean\n\t\tdeleteFile(ID:Int):Boolean\n\t}\n\ttype File {\n\t\tID:ID\n\t\tfilename:String\n\t\ttitle:String\n\t\tdate_created:String\n\t\tFK_User:Int\n\t\tFK_Mongo_Case:String\n\t}\n\ttype User{\n\t\tID:ID\n\t\tusername: String\n\t\tpassword: String\n\t\tisManager: Boolean\n\t}\n\ttype Note{\n\t\tID:ID\n\t\tmessenge: String\n\t\tFK_User: Int\n\t\tFK_Mongo_Case: String\n\t}\n"], ["\n\ttype Query {\n\t\tvalidateUser(username:String, password:String):User\n\t\tgetNotes(FK_Mongo_Case:String):[Note]\n\t\tgetFiles(FK_Mongo_Case:String):[File]\n\t}\n\ttype Mutation{\n\t\taddNote(messenge:String,FK_User:Int,FK_Mongo_Case:String):String\n\t\tdeleteNote(ID:Int):Boolean\n\t\tdeleteFile(ID:Int):Boolean\n\t}\n\ttype File {\n\t\tID:ID\n\t\tfilename:String\n\t\ttitle:String\n\t\tdate_created:String\n\t\tFK_User:Int\n\t\tFK_Mongo_Case:String\n\t}\n\ttype User{\n\t\tID:ID\n\t\tusername: String\n\t\tpassword: String\n\t\tisManager: Boolean\n\t}\n\ttype Note{\n\t\tID:ID\n\t\tmessenge: String\n\t\tFK_User: Int\n\t\tFK_Mongo_Case: String\n\t}\n"])));
var resolvers = {
    Query: {
        validateUser: function (_, _a, __) {
            var username = _a.username, password = _a.password;
            console.log(User.validateUser(username, password));
            return User.validateUser(username, password);
        },
        getNotes: function (_, _a) {
            var FK_Mongo_Case = _a.FK_Mongo_Case;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _c = (_b = console).log;
                            return [4 /*yield*/, note_1.default.getNotes(FK_Mongo_Case).then(function (value) { return console.log(value); })];
                        case 1:
                            _c.apply(_b, [_d.sent()]);
                            return [4 /*yield*/, note_1.default.getNotes(FK_Mongo_Case)];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
        getFiles: function (_, _a) {
            var FK_Mongo_Case = _a.FK_Mongo_Case;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _c = (_b = console).log;
                            return [4 /*yield*/, file_1.default.getFiles(FK_Mongo_Case).then(function (value) { return console.log(value); })];
                        case 1:
                            _c.apply(_b, [_d.sent()]);
                            return [4 /*yield*/, file_1.default.getFiles(FK_Mongo_Case)];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        }
    },
    Mutation: {
        addNote: function (_, _a) {
            var messenge = _a.messenge, FK_User = _a.FK_User, FK_Mongo_Case = _a.FK_Mongo_Case;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _c = (_b = console).log;
                            return [4 /*yield*/, note_1.default.addNote(messenge, FK_User, FK_Mongo_Case).then(function (value) { return console.log(value); })];
                        case 1:
                            _c.apply(_b, [_d.sent()]);
                            return [4 /*yield*/, note_1.default.addNote(messenge, FK_User, FK_Mongo_Case)];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
        deleteNote: function (_, _a) {
            var ID = _a.ID;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _c = (_b = console).log;
                            return [4 /*yield*/, note_1.default.deleteNote(ID).then(function (value) { return console.log(value); })];
                        case 1:
                            _c.apply(_b, [_d.sent()]);
                            return [4 /*yield*/, note_1.default.deleteNote(ID)];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
        deleteFile: function (_, _a) {
            var ID = _a.ID;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _c = (_b = console).log;
                            return [4 /*yield*/, file_1.default.deleteFile(ID).then(function (value) { return console.log(value); })];
                        case 1:
                            _c.apply(_b, [_d.sent()]);
                            return [4 /*yield*/, file_1.default.deleteFile(ID)];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        }
    },
    Client: {
        __resolveReference: function (client, _a) {
            var fetchUserById = _a.fetchUserById;
            return fetchUserById(client.id);
        }
    }
};
var server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs: typeDefs, resolvers: resolvers }])
});
var app = express_1.default();
app.use(cors());
app.use(sqlinjection); // add sql-injection middleware here
server.applyMiddleware({ app: app });
app.use('/file', file_2.filerouter);
app.listen({ port: 8889 }, function () {
    return console.log("\uD83D\uDE80 Server ready at http://localhost:8889");
});
var templateObject_1;
// import * as express from 'express';
// import userRouter from './api/user/user';
// import noteRouter from './api/note/note';
//
// import fileRouter from './api/file/file'
// export const app = express();
// import * as bodyParser from 'body-parser'
// const path = require('path')
// var mysql = require('mysql');
// app.use(bodyParser.json());
// app.use('/file', bodyParser.urlencoded({ extended: true }));
// app.use('/static', express.static(path.join(__dirname, './uploads')))
// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	port: '3306',
// 	user: 'root',
// 	password: 'example',
// 	database: 'taxDB'
// });
// export const mysqlConnection = connection;
//
// app.use('/user', userRouter);
// app.use('/note', noteRouter);
// app.use('/file', fileRouter);
// if (process.env.NODE_ENV !== 'test') {
// 	app.listen(8001)
// }
