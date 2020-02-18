import request from '../shared';
import {Response} from 'supertest'
import {mysqlConnection} from '../../index'
import { IUser } from './user';
export const newUser : IUser = {
    username: 'Chris',
    password: 'Cole',
    isManager: false
  }
describe('User /POST', ()=>{
  let newUserID:any;
  afterEach(async ()=>{
    if(newUserID){
      await request
      .delete('/user')
      .send({id: newUserID})
      newUserID = undefined
    }

  })
  it('it should insert a user', async (done)=>{
    await request
    .post('/user')
    .send(newUser).catch((err:any)=>{
      if(err){
        throw err;
        done()
      }
    })
    .then((res:Response)=>{
      newUserID = JSON.parse(res.text).insertId;
      expect(typeof JSON.parse(res.text).insertId).toBe('number');
      done()
    })
  })
  it('should fail on missing username',async ()=>{
    let postThrow = async function(){
        return await request
        .post('/user')
        .send({password:'some',isManager: false})
        .catch(e=>{
          throw e
        }).then((res:Response)=>{
          return [res.error.status, res.error.text]
        })
    }
    expect(await postThrow()).toEqual([422,'missing param username'])
  })
  it('should fail username not string',async()=>{
    let postThrow = async function(){
      return await request
      .post('/user')
      .send({username:1,password: 'sdf', isManager: true})
      .catch(e=>{
        throw e
      })
      .then((res: Response)=>{
        return [res.error.status,res.error.text]
      })
    }
    expect(await postThrow()).toEqual([422,'username is not a string'])
  })
  it('should fail empty string',async ()=>{
    let postThrow = async ()=>{
      return await request
      .post('/user')
      .send({username : '    ', password: 'dsfsdf',isManager:true})
      .catch(e=>{
        throw e
      })
      .then((res:Response)=>{

        return [res.error.status,res.error.text]
      })
    }
    expect(await postThrow()).toEqual([422,'username is empty'])
  })
  it('should fail missing password',async()=>{
    let postThrow = async ()=>{
      return await request
      .post('/user')
      .send({username: 'dsfdfs', isManager:true})
      .catch(e=>{
        throw e
      })
      .then((res:Response)=>{

        return [res.error.status,res.error.text]
      })
    }
    expect(await postThrow()).toEqual([422,'missing param password'])
  })
  it('should fail empty string',async ()=>{
    let postThrow = async ()=>{
      return await request
      .post('/user')
      .send({username: 'dfssdf',password: '    ', isManager: false})
      .catch(e=>{
        throw e
      })
      .then((res: Response)=>{
        return [res.error.status, res.error.text]
      })
    }
    expect(await postThrow()).toEqual([422,'password is empty'])
  })
  it('should fail is manager is missing',async ()=>{
    let postThrow = async ()=>
      await request
      .post('/user')
      .send({username: 'sdf', password: 'sdf'})
      .catch(err=>{
        throw err
      })
      .then((res:Response)=>
        [res.error.status,res.error.text]
      )
      expect(await postThrow()).toEqual([422,'missing param isManager'])
  })
  it('should fail isManager is not boolean',async ()=>{
      let postThrow = async ()=>
        await request
          .post('/user')
          .send({username: 'dsf',password: 'sdffsd', isManager:34})
          .catch(e=>{
            throw e
          })
          .then((res:Response)=>
            [res.error.status, res.error.text]
        )
      expect(await postThrow()).toEqual([422, 'isManager is not a boolean'])
  });
})

describe('User delete',()=>{
  let userId:any;
  beforeEach(async()=>{
    userId = await request
      .post('/user')
      .send(newUser)
      .catch(err=>{
        throw err
      })
      .then(res=>{return JSON.parse(res.text).insertId})

  })
  afterEach(async()=>{
    userId = await request
      .delete('/user')
      .send({id:userId})
      .catch(err=>{
        throw err
      })
  })
  it('should delete a user',async ()=>{
    let deleteThrow = async ()=>
      await request
      .delete('/user')
      .send({id: userId})
      .catch((err)=>{
        throw err
      })
      .then(res=>{
        return res.body.affectedRows
      })
    expect(await deleteThrow()).toBe(1)
  })
  it('should fail missing id',async ()=>{
    let deleteThrow = async ()=>
      await request
      .delete('/user')
      .send({})
      .catch(err=>{throw err})
      .then((res:Response)=>[res.error.status,res.error.text])
    expect(await deleteThrow()).toEqual([422,'Missing param id'])
  })
  it('should fail id not an positive intiger',async ()=>{
    let deleteThrow = async ()=>
      await request
      .delete('/user')
      .send({id:-1})
      .catch(err=>{throw err})
      .then((res:Response)=>[res.error.status,res.error.text])
    expect(await deleteThrow()).toEqual([422,'ID not a positive intiger'])
  })
  it('should fail row does not exist',async ()=>{
    let deleteThrow = async ()=>
      await request
      .delete('/user')
      .send({id:9999})
      .catch(err=>{throw err})
      .then((res:Response)=>res.body.affectedRows)
    expect(await deleteThrow()).toEqual(0)
  })
})
describe('User validate',()=>{
  let newUser : IUser;
  let newUserID: Number;
  newUser = {
    username: 'Chri',
    password: 'Cole',
    isManager: false
  };
  beforeEach(async (done)=>{
    await mysqlConnection.query("INSERT INTO `Users` (`username`,`password`,`isManager`) VALUES('"+newUser.username+"','"+newUser.password+"',"+newUser.isManager+")",function (error:any, results:any, fields:any) {
      if (error) throw error;
        newUserID = results.insertId;
        done()
      })
  })
  afterEach(async(done)=>{
    if(newUserID){
      await mysqlConnection.query("DELETE FROM Users WHERE ID='"+newUserID+"'",function(){  newUserID=0;done()})
    }


  })
  it('should return ID and isManager',async()=>{
    let getThrow = async()=>await request
    .get('/user/validate/?username='+newUser.username+'&password='+newUser.password)
    .send(newUser)
    .catch(e=>{throw e})
    .then((res:Response)=>{return res.body});
    expect(await getThrow()).toEqual({ID: newUserID, isManager: newUser.isManager})
  })
  it('should fail no username provided',async ()=>{
    let getThrow = async()=>await request
    .get('/user/validate')
    .send()
    .catch(e=>{throw e})
    .then((res:Response)=>[res.error.status,res.error.text]);
    expect(await getThrow()).toEqual([422,'Missing param username'])
  })
  it('should fail no password provided',async ()=>{
    let getThrow = async()=>await request
    .get('/user/validate/?username='+newUser.username)
    .send({username: 'hi'})
    .catch(e=>{throw e})
    .then((res:Response)=>[res.error.status,res.error.text]);
    expect(await getThrow()).toEqual([422,'Missing param password'])
  })
  it('should fail invalid credentials',async ()=>{
    let getThrow = async()=>await request
    .get('/user/validate/?username='+46556+'&password='+456456)
    .send()
    .catch(e=>{throw e})
    .then((res:Response)=>[res.error.status,res.error.text]);
    expect(await getThrow()).toEqual([404,'No matching user'])
  })
})
describe('Test /PUT change username',()=>{
  let newUserId: any;
  beforeEach(async()=>{
    newUserId = await request
    .post('/user')
    .send({username: 'test', password: 'hii' , isManager: true})
    .catch(e=>{throw e})
    .then((res:Response)=>res.body.insertId)
  })
  afterEach(async ()=>{
    await request
    .delete('/user')
    .send({id:newUserId})
    .catch(e=>{throw e})
  })
  it('should fail no id provided',async()=>{
    await request
    .put('/user/username')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param id'])
    })
  })
  it('should fail no username provided',async()=>{
    await request
    .put('/user/username')
    .send({id:newUserId})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param username'])
    })
  })
  it('should change the username',async()=>{
    await request
    .put('/user/username')
    .send({id: newUserId,username: 'Mike'})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect(res.status).toEqual(200)
    })
  })
})
describe('Test /PUT change password',()=>{
  let newUserId: any;
  beforeEach(async()=>{
    newUserId = await request
    .post('/user')
    .send({username: 'test', password: 'hii' , isManager: true})
    .catch(e=>{throw e})
    .then((res:Response)=>res.body.insertId)
  })
  afterEach(async ()=>{
    await request
    .delete('/user')
    .send({id:newUserId})
    .catch(e=>{throw e})
  })
  it('should fail no id provided',async()=>{
    await request
    .put('/user/password')
    .send({})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param id'])
    })
  })
  it('should fail no password provided',async()=>{
    await request
    .put('/user/password')
    .send({id:newUserId})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect([res.status,res.text]).toEqual([422,'Missing param password'])
    })
  })
  it('should change the password',async()=>{
    await request
    .put('/user/password')
    .send({id: newUserId,password: 'Mike'})
    .catch(e=>{throw e})
    .then((res:Response)=>{
      expect(res.status).toEqual(200)
    })
  })
})
