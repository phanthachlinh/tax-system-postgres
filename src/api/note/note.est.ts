import request from '../shared';
import {Response} from 'supertest'
import {mysqlConnection} from '../../index'
import {newUser} from '../user/user.test'
let newUserID;
let newCaseID;
let newNoteID;
describe('test /POST case',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",function (error:any, results:any, fields:any) {
      if (error) throw error;
        newUserID = results.insertId
        done()
      })
  })
  it('should fail no text provided',async()=>{
    await request
    .post('/note')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param text'])})
  })
  it('should fail no caseID provided',async()=>{
    await request
    .post('/note')
    .send({text: 'hiii'})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param caseID'])})
  })
  it('should fail no caseID provided',async()=>{
    await request
    .post('/note')
    .send({text: 'hiii'})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.error.status,res.error.text]).toEqual([422,'Missing param caseID'])})
  })
})
