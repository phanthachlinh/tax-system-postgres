import { mysqlConnection } from '../../../index'
import { MysqlError, FieldInfo } from 'mysql';
export default class UserApi {
	public async validateUser(username: string, password: string) {
		let values;
		return new Promise((resolve, reject) => {
			mysqlConnection.query("SELECT ID, isManager FROM `Users` WHERE username='" + username + "' AND `password`='" + password + "'", (error: MysqlError, results: any, fields: FieldInfo) => {

				if (error) throw error;
				if (results.length === 0) {
					resolve(null)
					return
				}
				console.log(results)
				resolve({ ID: results[0].ID, isManager: results[0].isManager ? true : false })

			})
		})


	}
}



// import express, { Router } from 'express';
// import { mysqlConnection } from '../../index';
// const router = Router();
// router.get('/validate', (req, res: express.Response) => {
// 	console.log(req.query)
// 	if (!req.query.username) {
// 		res.status(422).send('Missing param username');
// 		return
// 	}
//
// 	if (!req.query.password) {
// 		res.status(422).send('Missing param password');
// 		return
// 	}
// 	console.log('fff')
// 	mysqlConnection.query("SELECT ID, isManager FROM `Users` WHERE username='" + req.query.username + "' AND `password`='" + req.query.password + "'", (error: any, results: any, fields: any) => {
//
// 		if (error) throw error;
// 		console.log(results)
// 		if (results.length === 0) {
// 			res.status(404).send('No matching user');
// 			return
// 		}
// 		res.status(200).json({ ID: results[0].ID, isManager: results[0].isManager ? true : false })
//
// 	})
// });
// router.get('/', (req, res: express.Response) => {
//
//
// 	mysqlConnection.query("SELECT ID, isManager FROM `Users`", (error: any, results: any, fields: any) => {
//
// 		if (error) throw error;
//
// 		res.status(200).json(results)
//
// 	})
// });
// router.post('/', (req, res) => {
//
// 	let newUser = req.body;
// 	if (!req.body.username) {
// 		res.status(422).send('missing param username');
// 		return
// 	}
// 	if (typeof req.body.username !== 'string') {
// 		res.status(422).send('username is not a string');
// 		return
// 	}
// 	if (req.body.username.trim().length === 0) {
// 		res.status(422).send('username is empty');
// 		return
// 	}
// 	if (!req.body.password) {
// 		res.status(422).send('missing param password')
// 		return
// 	}
// 	if (req.body.password.trim().length == 0) {
// 		res.status(422).send('password is empty');
// 		return
// 	}
// 	if (typeof req.body.isManager === 'undefined') {
// 		res.status(422).send('missing param isManager')
// 		return
// 	}
// 	if (typeof req.body.isManager !== 'boolean') {
// 		res.status(422).send('isManager is not a boolean')
// 		return
// 	}
// 	mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('" + newUser.username + "','" + newUser.password + "'," + newUser.isManager + ")", function(error: any, results: any, fields: any) {
// 		if (error) throw error;
// 		res.status(200).send({ insertId: results.insertId, isManager: newUser.isManager })
// 	})
//
// })
// router.put('/username', (req, res) => {
// 	if (!req.body.id) {
// 		res.status(422).send('Missing param id')
// 		return
// 	}
// 	if (!req.body.username) {
// 		res.status(422).send('Missing param username')
// 		return
// 	}
// 	mysqlConnection.query("UPDATE Users SET username = '" + req.body.username + "' WHERE ID = " + req.body.id + "", function(error: any, results: any, fields: any) {
// 		if (error) throw error;
// 		res.status(200).send()
// 	})
// })
// router.put('/password', (req, res) => {
// 	if (!req.body.id) {
// 		res.status(422).send('Missing param id')
// 		return
// 	}
// 	if (!req.body.password) {
// 		res.status(422).send('Missing param password')
// 		return
// 	}
// 	mysqlConnection.query("UPDATE Users SET password = '" + req.body.password + "' WHERE ID = " + req.body.id + "", function(error: any, results: any, fields: any) {
// 		if (error) throw error;
// 		res.status(200).send()
// 	})
// })
// router.delete('/', async (req, res) => {
// 	if (!req.body.id) {
// 		res.status(422).send('Missing param id')
// 		return
// 	}
// 	if (typeof req.body.id != 'number' || req.body.id < 1) {
// 		res.status(422).send('ID not a positive intiger')
// 		return
// 	}
// 	await mysqlConnection.query("DELETE FROM Users WHERE ID = " + req.body.id + "", function(error: any, results: any, fields: any) {
// 		if (error) res.send(error);
// 		res.json(results)
// 	})
//
//
// })
// export interface IUser {
// 	username: String,
// 	password: String,
// 	isManager: Boolean
// }
// export default router
