import request from '../shared';
import {Response} from 'supertest'
import {newUser} from '../user/user.test'
import {mysqlConnection} from '../../index'
let newUserID: any;
let newCaseID:any;
let newCasesIDs: Array<any> = [];
let newCase = {
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
    if(typeof newCaseID !=='undefined'){
      await mysqlConnection.query("DELETE FROM Cases WHERE ID='"+newCaseID+"'",function(error: any){  if (error) throw error;done()})
    }
    done()
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
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",function (error:any, results:any, fields:any) {
      if (error) throw error;
        newUserID = results.insertId
      })
    for(let i = 0; i<15;i++){
      await mysqlConnection.query(`INSERT INTO Cases
        (status,country,date_created,FK_Mongo_Client,FK_user)
        VALUES ('${newCase.status}','${newCase.country}',CURRENT_TIMESTAMP,'${newCase.clientId}','${newUserID}')
        `,function (error:any, results:any, fields:any) {
          if (error) throw error;

            newCasesIDs.push(results.insertId)
            done()
        })
    }
  })
  afterEach(async(done)=>{
    for(let i = 0; i<newCasesIDs.length;i++){
      await mysqlConnection.query("DELETE FROM Cases WHERE ID = '"+newCasesIDs[i]+"'",function (error:any, results:any, fields:any) {
        if (error) throw error;
        done()
      })
    }
      newCasesIDs = [];
      await mysqlConnection.query("DELETE FROM Users WHERE ID = '"+newCaseID+"'",function (error:any, results:any, fields:any) {
        if (error) throw error;
      })
    })
    it('should fail no page provided',async (done)=>{
      await request
      .get('/case')
      .send({})
      .catch(e=>{throw e;done()})
      .then((res:Response)=>{expect([res.status, res.error.text]).toEqual([422,'Missing param page']);done()})
    })
/**    it('should get 5 rows',async (done)=>{
      await request
      .get('/case')
      .send({page:1})
      .catch(e=>{throw e;done()})
      .then((res:Response)=>{expect(res.body.length).toBe(5);done()})
    })**/
})
describe('test /DELETE case',()=>{
  beforeEach(async(done)=>{
    mysqlConnection.query("INSERT INTO Users (username,password,isManager) VALUES ('"+newUser.username+"','"+newUser.password+"','"+newUser.isManager+"')",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      console.log(results)
      done()
    })
  })
  afterEach(async(done)=>{
    mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",(error:any,results:any,fields:any)=>{
      if(error) throw error;
      console.log(results)
      done()
    })
    it('should fail no id provided',()=>{
      throw new Error
    })
  })
})
