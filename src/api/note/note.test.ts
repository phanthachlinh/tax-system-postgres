import request from '../shared';
import {Response} from 'supertest'
import {mysqlConnection} from '../../index'
import {newUser} from '../user/user.test';
import {newCase} from '../case/case.test'
let newUserID:any;
let newCaseID:any;
let newNoteID:any;
let newNotesIDs:any=[];
describe('test /POST case',()=>{
  beforeEach(async(done)=>{
    await setupEntries(done)
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      done()
    })
  })
  it('should fail no messenge provided',async()=>{
    await request
    .post('/note')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param messenge'])})
  })
  it('should fail no caseID provided',async()=>{
    await request
    .post('/note')
    .send({messenge: 'hiii'})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param caseID'])})
  })
  it('should fail no FK_User provided',async()=>{
    await request
    .post('/note')
    .send({messenge: 'hiii',caseID: newCaseID})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param FK_User'])})
  })
  it('should post a note',async()=>{
    await request
    .post('/note')
    .send({messenge: 'hiii',caseID:newCaseID,FK_User:newUserID})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(res.status).toEqual(200)})
  })
})
describe('test /DELETE CASE',()=>{
  beforeEach(async(done)=>{
    await setupEntries(done)
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      done()
    })
  })
  it('should fail no id provided',async()=>{
    await request
    .delete('/note')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422, 'Missing param id'])})
  })
  it('should delete a note',async()=>{
    await request
    .delete('/note')
    .send({id: newNoteID})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(res.body).toEqual(1)})
  })
})
describe('test /GET notes',()=>{
  beforeEach(async(done)=>{
    await setupMultipleNotes(done)
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      done()
    })
  })
  it('should fail no page provided',async()=>{
    await request
    .get('/note')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param page'])})
  })
  it('should get 5 notes',async()=>{
    await request
    .get('/note')
    .send({page:1})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(res.body.length).toEqual(5)})
  })
})
describe('test /PUT case',()=>{
  beforeEach(async(done)=>{
    await setupEntries(done)
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      done()
    })
  })
  it('should fail no messenge provided',async()=>{
    await request
    .put('/note')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param messenge'])})
  })
  it('should fail no Note ID provided',async()=>{
    await request
    .put('/note')
    .send({messenge: 'hiii'})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param noteID'])})
  })

  it('should post a note',async()=>{
    await request
    .put('/note')
    .send({messenge: 'hiii',noteID:newNoteID})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(res.body.affectedRows).toEqual(1)})
  })
})
async function  setupEntries(done:any){
  await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
    newUserID = results.insertId
    if (error) throw error;
    await mysqlConnection.query(`INSERT INTO Cases
      (status,country,date_created,FK_Mongo_Client,FK_User)
      VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
      `,async function (error:any, results:any, fields:any) {
        if (error) throw error;
          newCaseID = results.insertId;
          await mysqlConnection.query(`INSERT INTO Notes
            (messenge,FK_User,FK_Case)
            VALUES ('hi','${newUserID}','${newCaseID}')
            `,function (error:any, results:any, fields:any) {
              if (error) throw error;
                newNoteID = results.insertId
              done()
            })
      })
    })
}
async function  setupMultipleNotes(done:any){
  await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
    newUserID = results.insertId
    if (error) throw error;
    await mysqlConnection.query(`INSERT INTO Cases
      (status,country,date_created,FK_Mongo_Client,FK_User)
      VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
      `,async function (error:any, results:any, fields:any) {
        if (error) throw error;
          newCaseID = results.insertId;
          for(let i = 0; i<15;i++){
          await mysqlConnection.query(`INSERT INTO Notes
            (messenge,FK_User,FK_Case)
            VALUES ('hi','${newUserID}','${newCaseID}')
            `,function (error:any, results:any, fields:any) {
              if (error) throw error;
                newNotesIDs.push(results.insertId)
                if(i==14) done()
            })
          }
      })
    })
}
