import request from '../shared';
import {Response} from 'supertest'
import {mysqlConnection} from '../../index'
import {newUser} from '../user/user.test';
import {newCase} from '../case/case.test'
const fs = require('fs')
const path = require( 'path');
let newUserID:any;
let newCaseID:any;
let newFilename:any;
let newFilesIDs:Array<any> = []
let newFileId:any;
describe('Test /POST file',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
      if (error) throw error;
      newUserID = results.insertId
      await mysqlConnection.query(`INSERT INTO Cases
        (status,country,date_created,FK_Mongo_Client,FK_User)
        VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
        `,async function (error:any, results:any, fields:any) {
          if (error) throw error;
            newCaseID = results.insertId;
            done()
          })
    })
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      fs.unlink(path.join(__dirname,'../../uploads/'+newFilename),()=>{})
      done()
    })
  })
  it('should fail no FK_Case provided',async()=>{
    await request
    .post('/file')
    .attach('file',path.join(__dirname,'../../temp/sample.pdf'))
    .field('s', newUserID)
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param FK_Case'])})
  })
  it('should fail no FK_User provided',async()=>{
    await request
    .post('/file')
      .field('FK_Case', newUserID)
    .attach('file',path.join(__dirname,'../../temp/sample.pdf'))

    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param FK_User'])})
  })
  it('should fail wrong file format',async()=>{
    await request
    .post('/file')
    .field('FK_User', newUserID)
    .field('FK_Case', newCaseID)
    .attach('file',path.join(__dirname,'../../temp/logo.png'))

    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Wrong filetype'])})
  })
  it('should insert a file',async()=>{
    await request
    .post('/file')
    .field('FK_User', newUserID)
    .field('FK_Case', newCaseID)
    .attach('file',path.join(__dirname,'../../temp/sample.pdf'))

    .catch(e=>{throw e})
    .then((res:Response)=>{newFilename = res.body.filename;expect(res.status).toEqual(200)})
  })
})
describe('Test /DELETE file',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
      if (error) throw error;
      newUserID = results.insertId
      await mysqlConnection.query(`INSERT INTO Cases
        (status,country,date_created,FK_Mongo_Client,FK_User)
        VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
        `,async function (error:any, results:any, fields:any) {
          if (error) throw error;
            newCaseID = results.insertId;
            await request
            .post('/file')
            .field('FK_User', newUserID)
            .field('FK_Case', newCaseID)
            .attach('file',path.join(__dirname,'../../temp/sample.pdf'))
            .catch(e=>{throw e})
            .then((res:Response)=>{newFilename=res.body.filename;newFileId = res.body.insertId;done()})

          })
    })
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
        fs.unlink(path.join(__dirname,'../../uploads/'+newFilename),()=>{})

      done()
    })
  })
  it('should fail no id provided',async()=>{
    await request
    .delete('/file')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param id'])})
  })
  it('should fail no filename provided',async()=>{
    await request
    .delete('/file')
    .send({id: newFileId})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param filename'])})
  })
  it('should delete a file',async()=>{
    await request
    .delete('/file')
    .send({id: newFileId, filename: newFilename})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(res.status).toEqual(200)})
  })
})
describe('Test /GET files',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
      if (error) throw error;
      newUserID = results.insertId
      await mysqlConnection.query(`INSERT INTO Cases
        (status,country,date_created,FK_Mongo_Client,FK_User)
        VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
        `,async function (error:any, results:any, fields:any) {
          if (error) throw error;
            newCaseID = results.insertId;
            for(let i = 0; i<15;i++){
              await request
              .post('/file')
              .field('FK_User', newUserID)
              .field('FK_Case', newCaseID)
              .attach('file',path.join(__dirname,'../../temp/sample.pdf'))
              .catch(e=>{throw e})
              .then((res:Response)=>{newFilesIDs.push(res.body.filename);if(i===14) done()});
            }
      })
    })
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",async (error:any,results:any,fields:any)=>{
      if(error) throw error;
        for(let i = 0; i<newFilesIDs.length;i++){
            await fs.unlink(path.join(__dirname,'../../uploads/'+newFilesIDs[i]),()=>{if(i===newFilesIDs.length-1) {newFilesIDs = [];done()}})
        }
    })
  })
  it('should fail no page provided',async ()=>{
    await request
    .get('/file')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect([res.status,res.error.text]).toEqual([422,'Missing param page'])
    })
  })
  it('should fail no page provided',async ()=>{
    await request
    .get('/file')
    .send({page:1})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect(res.body.length).toEqual(5)
    })
  })
})
