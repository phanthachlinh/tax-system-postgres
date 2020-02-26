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
var __1 = require("../../..");
exports.default = {
    // getClients: async (searchTerm: string, page: number) =>
    //
    // 	await Client.aggregate(getAggregations(searchTerm, page)).then((response: any, error: any) => {
    // 		return {
    // 			results: response[0].results,
    // 			count: response[0].count.length === 0 ? 0 : response[0].count[0].id
    // 		}
    // 	}),
    addNote: function (messenge, FK_User, FK_Mongo_Case) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                __1.mysqlConnection.query("CALL `taxDB`.`insert_and_get_id`('" + messenge + "', " + FK_User + ",'" + FK_Mongo_Case + "')", function (error, results, fields) {
                    if (error) {
                        throw error;
                        reject();
                    }
                    ;
                    console.log(results[0][0]);
                    resolve(results[0][0].ID);
                });
                return [2 /*return*/];
            });
        }); });
    },
    getNotes: function (FK_Mongo_Case) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                __1.mysqlConnection.query("SELECT * FROM Notes WHERE FK_Mongo_Case='" + FK_Mongo_Case + "' ORDER BY date_created asc", function (error, results, fields) {
                    if (error) {
                        throw error;
                        reject();
                    }
                    ;
                    console.log(results);
                    resolve(results);
                });
                return [2 /*return*/];
            });
        }); });
    },
    deleteNote: function (ID) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                __1.mysqlConnection.query("DELETE FROM Notes WHERE ID='" + ID + "'", function (error, results, fields) {
                    if (error) {
                        throw error;
                        reject();
                    }
                    ;
                    console.log(results);
                    resolve(true);
                });
                return [2 /*return*/];
            });
        }); });
    }
    // updateClient: async (_id: string, input: any) => {
    // 	if (input['date_of_birth'] === '')
    // 		delete input['date_of_birth']
    // 	Object.keys(input).map((key: string) => {
    // 		if (input[key] === 'undefined')
    // 			delete input[key]
    // 	})
    // 	console.log(input)
    // 	await Client.findOneAndUpdate({ _id }, { "$set": input }, { new: true }, (err: any) => { if (err) throw err })
    // 	return true
    // },
    // removeClient: async (_id: string) => {
    // 	await Client.findByIdAndRemove(_id, ((err: any) => {
    // 		if (err)
    // 			throw err
    // 	}))
    // 	return true
    // }
};
function getAggregations(searchTerm, page) {
    return [{
            "$facet": {
                results: [
                    {
                        "$match": {
                            "$or": [
                                { first_name: { "$regex": searchTerm } },
                                { last_name: { "$regex": searchTerm } }
                            ]
                        }
                    },
                    {
                        "$sort": { "date_created": -1 }
                    },
                    {
                        "$skip": 5 * (page - 1)
                    },
                    {
                        "$limit": 5
                    }
                ],
                count: [
                    {
                        "$match": {
                            "$or": [
                                { first_name: { "$regex": searchTerm } },
                                { last_name: { "$regex": searchTerm } }
                            ]
                        }
                    },
                    {
                        "$count": "id"
                    }
                ]
            }
        }
    ];
}
// import express,{Response, NextFunction} from 'express'
// import IClient from './client.d';
// var router = require('express').Router();
// var mongoose = require('../../mongoInstance.ts').getMongoose();
// const clientSchema = require('../../schema/Client.schema.ts').default;
// const multer = require('multer');
// const upload = multer()
// var Client = mongoose.model('Client',clientSchema)
// router.get('/', (req: express.Request,res: Response)=>{
//   let searchObject:Array<any> = []
//   console.log(req.query)
//
//   console.log('sfd')
//   console.log(req.query.searchTerm!=''&&typeof req.query.searchTerm!=='undefined')
//   if(req.query.searchTerm!=''&&typeof req.query.searchTerm!=='undefined')
//     searchObject =
//       [
//         {first_name: {$regex:req.query.searchTerm,$options: "g"}},
//         {last_name: {$regex:req.query.searchTerm,$options: "g"}}
//       ]
//       // console.log(!req.query.searchTerm||req.query.searchTerm==''?{}:{$or:searchObject})
//   Client.find(!searchObject[0]?{}:{$or:searchObject},null,{skip:(5*(parseInt(req.query.page)-1)),limit:5}).sort( { date_created: -1 } ).then((results:any)=>{
//     Client.count(!searchObject[0]?{}:{$or:searchObject}).then((count:number)=>{
//
//       console.log({count,results})
//           res.send({count,results})
//     })
//
//   })
// })
// router.post('/',upload.none(), (req:express.Request, res:Response)=>{
//   if(!req.body.first_name){
//     res.status(422).send('Missing param first_name')
//     return
//   }
//   if(!req.body.last_name){
//     res.status(422).send('Missing param last_name')
//     return
//   }
//   if(typeof req.body.coming_from === 'undefined'){
//     res.status(422).send('Missing param coming_from')
//     return
//   }
//   if(!req.body.date_of_birth){
//     res.status(422).send('Missing param date_of_birth')
//     return
//   }
//   if(typeof req.body.civil_status === 'undefined'){
//     res.status(422).send('Missing param civil_status')
//     return
//   }
//   if(!req.body.amount_of_children){
//     res.status(422).send('Missing param amount_of_children')
//     return
//   }
//   if(!req.body.home_address){
//     res.status(422).send('Missing param home_address')
//     return
//   }
//   if(!req.body.foreign_address){
//     res.status(422).send('Missing param foreign_address')
//     return
//   }
//   if(!req.body.email){
//     res.status(422).send('Missing param email')
//     return
//   }
//   if(!req.body.telephone){
//     res.status(422).send('Missing param telephone')
//     return
//   }
//   if(!req.body.FK_User){
//     res.status(422).send('Missing param FK_user')
//     return
//   }
//
//
//   req.body.date_created = Date.now();
//   let newClient = new Client(req.body);
//   newClient.save((err:any)=>{
//      if(err){
//        res.status(500).send({path:err.path,message:err.message})
//        return
//      }else{
//        res.send(newClient)
//     }
//   });
// })
// router.delete('/',(req:any,res:any)=>{
//   if(!req.body._id){
//     res.status(422).send('Missing param id');
//     return
//   }
//   Client.deleteOne({_id: req.body._id},(err:any)=>{
//     if(err) throw err
//     res.status(200).send({_id:req.body._id})
//   })
// })
// router.put('/',upload.none(),(req:any,res:any)=>{
//   if(!req.body._id){
//     res.status(422).send('Missing param _id');
//     return
//   }
//   Client.findByIdAndUpdate(
//     req.body._id,
//     req.body,
//     {new:true},
//     (err:any, client:IClient) => {
//     // Handle any possible database errors
//         if (err) return res.status(500).send(err);
//         return res.status(200).json(client);
//     }
// )
// })
// module.exports = router
// import express,{Router} from 'express';
// import {mysqlConnection} from '../../index';
// const router = Router();
// router.post('/',(req:any,res:any)=>{
//   if(!req.body.messenge){
//     res.status(422).send('Missing param messenge');
//     return
//   }
//   if(!req.body.FK_Mongo_Case){
//     res.status(422).send('Missing param caseID');
//     return
//   }
//
//   if(!req.body.FK_User){
//     res.status(422).send('Missing param FK_User');
//     return
//   }
//
//   mysqlConnection.query("INSERT INTO `taxDB`.`Notes` (`messenge`,`date_created`,`FK_User`,`FK_Mongo_Case`) VALUES ('"+req.body.messenge+"',CURRENT_TIMESTAMP,"+req.body.FK_User+",'"+req.body.FK_Mongo_Case+"')"
//   ,function(error:any,results:any,fields:any){
//     if(error)throw error;
//     mysqlConnection.query(`SELECT * FROM Notes WHERE ID= LAST_INSERT_ID()`
//     ,function(error:any,results:any,fields:any){
//       if(error)throw error;
//       res.send(results[0])
//     })
//   })
// })
// router.delete('/',(req:any,res:any)=>{
//   if(!req.query.id){
//     res.status(422).send('Missing param id');
//     return
//   }
//
//   mysqlConnection.query(`DELETE FROM Notes WHERE ID = ${req.query.id}`
//   ,function(error:any,results:any,fields:any){
//     if(error)throw error;
//     res.json(results.affectedRows)
//   })
// })
// router.get('/',(req:any,res:any)=>{
//   mysqlConnection.query(`SELECT * FROM Notes ORDER BY date_created asc `
//   ,function(error:any,results:any,fields:any){
//     if(error)throw error;
//     res.json(results)
//   })
// })
// router.put('/',(req:any,res:any)=>{
//   if(!req.body.messenge){
//     res.status(422).send('Missing param messenge');
//     return
//   }
//   if(!req.body.noteID){
//     res.status(422).send('Missing param noteID');
//     return
//   }
//   mysqlConnection.query(`UPDATE Notes SET messenge = '${req.body.messenge}' WHERE ID = ${req.body.noteID}`
//   ,function(error:any,results:any,fields:any){
//     if(error)throw error;
//     res.json(results)
//   })
// })
// export default router
