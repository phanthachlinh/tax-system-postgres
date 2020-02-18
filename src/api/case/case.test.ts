import request from '../shared';
import {Response} from 'supertest'
import {newUser} from '../user/user.test'
import {mysqlConnection} from '../../index'
let newUserID: any;
let newCaseID:any;
let newCasesIDs: Array<any> = [];
export const newCase:any = {
  status:1,
  country:'de',
  date_created: Date.now(),
  clientId: 'sdf'
}
describe('Test /POST case',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",function (error:any, results:any, fields:any) {
      if (error) throw error;
        newUserID = results.insertId;
        done()
      })
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",function(error: any){  if (error) throw error;done()})
   })
  it('should fail missing status',async()=>{
    await request
    .post('/case')
    .send({})
    .catch((e: any)=>{throw e})
    .then((res: Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param status'])
    })
  })
  it('should fail missing country',async()=>{
    await request
    .post('/case')
    .send({status:1})
    .catch((e: any)=>{throw e})
    .then((res: Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param country'])
    })
  })
  it('should fail missing date_created',async()=>{
    await request
    .post('/case')
    .send({status:1,country:'de'})
    .catch((e: any)=>{throw e})
    .then((res: Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param date_created'])
    })
  })
  it('should fail missing clientId',async()=>{
    await request
    .post('/case')
    .send({status:1,country:'de',date_created: Date.now()})
    .catch((e: any)=>{throw e})
    .then((res: Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param clientId'])
    })
  })
  it('should fail missing userId',async()=>{
    await request
    .post('/case')
    .send({status:1,country:'de',date_created: Date.now(),clientId:'wqdas'})
    .catch((e: any)=>{throw e})
    .then((res: Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param userId'])
    })
  })
  it('should insert a case',async(done)=>{
    await request
    .post('/case')
    .send({status:1,country:'de',date_created: Date.now(),clientId:'wqdas',userId:newUserID})
    .catch((e: any)=>{throw e})
    .then((res: Response)=>{
      newCaseID = res.body.id;
      expect(res.status).toEqual(200);
      done()
    })
  })
})
describe('Test /GET case',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
      if (error) throw error;
        newUserID = results.insertId;
        for(let i = 0; i<15;i++){
          await mysqlConnection.query(`INSERT INTO Cases
            (status,country,date_created,FK_Mongo_Client,FK_User)
            VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
            `,function (error:any, results:any, fields:any) {
              if (error) throw error;
                newCasesIDs.push(results.insertId)
                if(i==14){done()}
            })
        }
      })

  })
  afterEach(async(done)=>{
      await mysqlConnection.query("DELETE FROM Users WHERE ID = '"+newUserID+"'",function (error:any, results:any, fields:any) {
        if (error) throw error;
        newCasesIDs = [];
        done()
      })
    })
    it('should fail no page provided',async (done)=>{
      await request
      .get('/case')
      .send({})
      .catch(e=>{throw e;done()})
      .then((res:Response)=>{expect([res.status, res.error.text]).toEqual([422,'Missing param page']);done()})
    })
   it('should get 5 rows',async (done)=>{
      await request
      .get('/case')
      .send({page:1})
      .catch(e=>{throw e;done()})
      .then((res:Response)=>{expect(res.body.length).toBe(5);done()})
    })
})
describe('test /DELETE case',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
      newUserID = results.insertId
      if (error) throw error;
      await mysqlConnection.query(`INSERT INTO Cases
        (status,country,date_created,FK_Mongo_Client,FK_User)
        VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
        `,function (error:any, results:any, fields:any) {
          if (error) throw error;
            newCaseID = results.insertId
          done()
        })
      })
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      done()
    })
  })
  it('should fail no id provided',async()=>{
    await request
    .delete('/case')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param id'])})
  })
  it('should post a case',async()=>{
    await request
    .delete('/case')
    .send({id:newCaseID})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(1).toEqual(res.body.affectedRows)})
  })
})
describe('Test /PUT case',()=>{
  beforeEach(async(done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",async function (error:any, results:any, fields:any) {
      newUserID = results.insertId
      if (error) throw error;
      await mysqlConnection.query(`INSERT INTO Cases
        (status,country,date_created,FK_Mongo_Client,FK_User)
        VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
        `,function (error:any, results:any, fields:any) {
          if (error) throw error;
            newCaseID = results.insertId
          done()
        })
      })
  })
  afterEach(async(done)=>{
    await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      done()
    })
  })
  it('should fail missing id',async()=>{
    await request
    .put('/case')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param id'])})
  })
  it('should fail missing status',async()=>{
    await request
    .put('/case')
    .send({id: newCaseID})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param status'])})
  })
  it('should fail missing country',async()=>{
    await request
    .put('/case')
    .send({id: newCaseID, status:newCase.status})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect([res.status,res.error.text]).toEqual([422,'Missing param country'])})
  })
  it('should update a case',async()=>{
    await request
    .put('/case')
    .send({id: newCaseID, status:newCase.status, country: newCase.country})
    .catch(e=>{throw e})
    .then((res:Response)=>{expect(res.body.affectedRows).toEqual(1)})
  })// && !req.body.status&&!req.body.country)
})

  //(status,country,date_created,FK_Mongo_Client,FK_User)
