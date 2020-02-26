"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../../index");
var UserApi = /** @class */ (function () {
    function UserApi() {
    }
    UserApi.prototype.validateUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var values;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1.mysqlConnection.query("SELECT ID, isManager FROM `Users` WHERE username='" + username + "' AND `password`='" + password + "'", function (error, results, fields) {
                            if (error)
                                throw error;
                            if (results.length === 0) {
                                resolve(null);
                                return;
                            }
                            console.log(results);
                            resolve({ ID: results[0].ID, isManager: results[0].isManager ? true : false });
                        });
                    })];
            });
        });
    };
    return UserApi;
}());
exports.default = UserApi;
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
