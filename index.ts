import { Connection } from "mysql";
import NoteApi from './src/api/note/note';
import FileApi from './src/api/file/file';
const { ApolloServer, gql } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
import { filerouter } from './src/api/file/file'
import express from 'express';
var mysql = require('mysql');
import UserFacade from './src/api/user/user'
const User = new UserFacade();
var cors = require('cors');
var sqlinjection = require('sql-injection');
export const mysqlConnection: Connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'example',
	database: 'taxDB'
});
const typeDefs = gql`
	type Query {
		validateUser(username:String, password:String):User
		getNotes(FK_Mongo_Case:String):[Note]
		getFiles(FK_Mongo_Case:String):[File]
	}
	type Mutation{
		addNote(messenge:String,FK_User:Int,FK_Mongo_Case:String):String
		deleteNote(ID:Int):Boolean
		deleteFile(ID:Int):Boolean
	}
	type File {
		ID:ID
		filename:String
		title:String
		date_created:String
		FK_User:Int
		FK_Mongo_Case:String
	}
	type User{
		ID:ID
		username: String
		password: String
		isManager: Boolean
	}
	type Note{
		ID:ID
		messenge: String
		FK_User: Int
		FK_Mongo_Case: String
	}
`;

const resolvers = {
	Query: {
		validateUser(_: any, { username, password }: { username: string, password: string }, __: any) {
			console.log(User.validateUser(username, password))
			return User.validateUser(username, password)
		},
		getNotes: async (_: any, { FK_Mongo_Case }: { FK_Mongo_Case: string }) => {
			console.log(await NoteApi.getNotes(FK_Mongo_Case).then((value: number) => console.log(value)))
			return await NoteApi.getNotes(FK_Mongo_Case)
		},
		getFiles: async (_: any, { FK_Mongo_Case }: { FK_Mongo_Case: string }) => {
			console.log(await FileApi.getFiles(FK_Mongo_Case).then((value: number) => console.log(value)))
			return await FileApi.getFiles(FK_Mongo_Case)
		}
	},
	Mutation: {
		addNote: async (_: any, { messenge, FK_User, FK_Mongo_Case }: { messenge: string, FK_User: number, FK_Mongo_Case: string }) => {
			console.log(await NoteApi.addNote(messenge, FK_User, FK_Mongo_Case).then((value: number) => console.log(value)))
			return await NoteApi.addNote(messenge, FK_User, FK_Mongo_Case)
		},
		deleteNote: async (_: any, { ID }: { ID: number }) => {
			console.log(await NoteApi.deleteNote(ID).then((value: number) => console.log(value)))
			return await NoteApi.deleteNote(ID)
		},
		deleteFile: async (_: any, { ID }: { ID: number }) => {
			console.log(await FileApi.deleteFile(ID).then((value: number) => console.log(value)))
			return await FileApi.deleteFile(ID)
		}
	},
	Client: {
		__resolveReference(client: { id: number }, { fetchUserById }: any) {
			return fetchUserById(client.id)
		}
	}

}

const server = new ApolloServer({
	schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

const app = express();
app.use(cors());
app.use(sqlinjection);  // add sql-injection middleware here

server.applyMiddleware({ app });
app.use('/file', filerouter)
app.listen({ port: 8889 }, () =>
	console.log(`🚀 Server ready at http://localhost:8889`)
);




































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
