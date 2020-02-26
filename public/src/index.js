var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var buildFederatedSchema = require('@apollo/federation').buildFederatedSchema;
var typeDefs = gql(__makeTemplateObject(["\n\ttype Query {\n\t\tvalidateUser(username:String, password:String):\n\t}\n\ttype User{\n\t\tID:ID\n\t\tusername: String\n\t\tpassword: String\n\t\tisManager: boolean\n\t}\n"], ["\n\ttype Query {\n\t\tvalidateUser(username:String, password:String):\n\t}\n\ttype User{\n\t\tID:ID\n\t\tusername: String\n\t\tpassword: String\n\t\tisManager: boolean\n\t}\n"]));
var resolvers = {
    Query: {
        validateUser: function (_, _a, __) {
            var username = _a.username, password = _a.password;
            return { ID: 5, username: 'test', password: 'ptest', isManager: true };
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
server.listen(8889).then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80 Server ready at " + url);
});
// import * as express from 'express';
// import userRouter from './api/user/user';
// import noteRouter from './api/note/note';
//
// import fileRouter from './api/file/file'
// export const app = express();
// import * as bodyParser from 'body-parser'
// const path = require('path')
// var cors = require('cors');
// app.use(cors());
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
