// import request from '../shared';
// import {Response} from 'supertest'
// import {mysqlConnection} from '../../index'
// import {newUser} from '../user/user.test';
// const fs = require('fs')
// const path = require( 'path');
// let newUserID:any;
// let newCaseID:any;
// let newFilename:any;
// let newFilesIDs:Array<any> = []
// let newFiles:Array<any>=[];
// let newFileId:any;
// describe('Test /POST file',()=>{
//   beforeEach(async(done)=>{
//     await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
//       if (error) throw error;
//       newUserID = results.insertId
//       done()
//     })
//   })
//   afterEach(async(done)=>{
//     await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
//       if(error) throw error;
//       fs.unlink(path.join(__dirname,'../../uploads/'+newFilename),()=>{})
//       done()
//     })
//   })
//   it('should fail no FK_Case provided',async()=>{
//     await request
//     .post('/file')
//     .field('s', newUserID)
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param FK_Case'])})
//   })
//   it('should fail no FK_User provided',async()=>{
//     await request
//     .post('/file')
//     .field('FK_Mongo_Case', 'newUserID')
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param FK_User'])})
//   })
//   it('should fail wrong file format',async()=>{
//     await request
//     .post('/file')
//     .field('FK_User', newUserID)
//     .field('FK_Mongo_Case', 'sdfsdf')
//     .attach('File',path.join(__dirname,'../../temp/game.mp3'))
//
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect(res.status).toEqual(500)})
//   })
//   it('should insert a file',async()=>{
//     await request
//     .post('/file')
//     .field('FK_User', newUserID)
//     .field('FK_Mongo_Case', 'f')
//     .attach('File',path.join(__dirname,'../../temp/sample.pdf'))
//
//     .catch(e=>{throw e})
//     .then((res:Response)=>{newFilename = res.body.filename;expect(res.status).toEqual(200)})
//   })
// })
// describe('Test /DELETE file',()=>{
//   beforeEach(async(done)=>{
//     await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
//       if (error) throw error;
//       newUserID = results.insertId;
//       await request
//       .post('/file')
//       .field('FK_User', newUserID)
//       .field('FK_Mongo_Case', 'f')
//       .attach('File',path.join(__dirname,'../../temp/sample.pdf'))
//       .then((res:Response)=>{newFileId = res.body.ID,newFilename = res.body.filename})
//       done()
//     })
//   })
//   afterEach(async(done)=>{
//     await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
//       if(error) throw error;
//         fs.unlink(path.join(__dirname,'../../uploads/'+newFilename),()=>{})
//
//       done()
//     })
//   })
//   it('should fail no id provided',async()=>{
//     await request
//     .delete('/file')
//     .send({})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param id'])})
//   })
//
//   it('should delete a file',async()=>{
//     await request
//     .delete('/file')
//     .query({id: newFileId})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect(res.status).toEqual(200)})
//   })
// })
//
// describe('Test /DELETE file',()=>{
//   beforeEach(async(done)=>{
//     await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
//       if (error) throw error;
//       newUserID = results.insertId;
//       await request
//       .post('/file')
//       .field('FK_User', newUserID)
//       .field('FK_Mongo_Case', 'f')
//       .attach('File',path.join(__dirname,'../../temp/sample.pdf'))
//       .then((res:Response)=>{newFileId = res.body.ID,newFilename = res.body.filename})
//       done()
//     })
//   })
//   afterEach(async(done)=>{
//     await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
//       if(error) throw error;
//         fs.unlink(path.join(__dirname,'../../uploads/'+newFilename),()=>{})
//
//       done()
//     })
//   })
//   it('should fail no title provided',async()=>{
//     await request
//     .put('/file')
//     .send({})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param title'])})
//   })
//   it('should fail no id provided',async()=>{
//     await request
//     .put('/file')
//     .send({title:'sfd'})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param id'])})
//   })
//   it('should update a file',async()=>{
//     await request
//     .put('/file')
//     .send({title:'sfd',id:newFileId})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{expect(res.body.affectedRows).toEqual(1)})
//   })
//
// })
//
// describe('Test /GET files',()=>{
//   beforeEach(async(done)=>{
//     await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
//       if (error) throw error;
//       newUserID = results.insertId
//       for(let i = 0; i<5;i++){
//         newFiles.push(await postFiles(results.insertId))
//       }
//       done()
//     })
//   })
//   afterEach(async(done)=>{
//     await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",async (error:any,results:any,fields:any)=>{
//       if(error) throw error;
//         for(let i = 0; i<newFiles.length;i++){
//             await fs.unlink(path.join(__dirname,'../../uploads/'+newFiles[i].filename),()=>{if(i===newFilesIDs.length-1) {newFilesIDs = []}})
//         }
//         newFiles = []
//         done()
//     })
//   })
//   it('should fail no page provided',async (done)=>{
//     await request
//     .get('/file')
//     .query({})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{
//       expect([res.status,res.error.text]).toEqual([422,'Missing param page']);done()
//     })
//   })
//   it('should get 5 files',async ()=>{
//     await request
//     .get('/file')
//     .query({page:1})
//     .catch(e=>{throw e})
//     .then((res:Response)=>{
//       expect(res.body.length).toEqual(5)
//     })
//   })
// })
//
// async function postFiles(userId:number){
//   return await request
//   .post('/file')
//   .field('FK_User', userId)
//   .field('FK_Mongo_Case', 'f')
//   .attach('File',path.join(__dirname,'../../temp/sample.pdf'))
//   .catch(e=>{throw e})
//   .then((res:Response)=>{
//     return res.body
//     })
//   }
