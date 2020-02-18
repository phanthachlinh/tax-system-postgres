import express,{Router} from 'express';
import {mysqlConnection} from '../../index';
const router = Router();
router.post('/',(req:any,res:any)=>{
  console.log(req.body)
  if(!req.body.messenge){
    res.status(422).send('Missing param messenge');
    return
  }
  if(!req.body.FK_Mongo_Case){
    res.status(422).send('Missing param caseID');
    return
  }

  if(!req.body.FK_User){
    res.status(422).send('Missing param FK_User');
    return
  }
  mysqlConnection.query(`INSERT INTO Notes (messenge, FK_User, FK_Mongo_Case,date_created)
  VALUES ('${req.body.messenge}','${req.body.FK_User}','${req.body.FK_Mongo_Case}',CURRENT_TIMESTAMP)`
  ,function(error:any,results:any,fields:any){
    if(error)throw error;
    console.log('ff',fields)
    mysqlConnection.query(`SELECT * FROM Notes WHERE ID= LAST_INSERT_ID()`
    ,function(error:any,results:any,fields:any){
      if(error)throw error;
      console.log(results)
      res.send(results)
    })
  })
})
router.delete('/',(req:any,res:any)=>{
  console.log(req.query)
  if(!req.query.id){
    res.status(422).send('Missing param id');
    return
  }

  mysqlConnection.query(`DELETE FROM Notes WHERE ID = ${req.query.id}`
  ,function(error:any,results:any,fields:any){
    if(error)throw error;
    res.json(results.affectedRows)
  })
})
router.get('/',(req:any,res:any)=>{
  mysqlConnection.query(`SELECT * FROM Notes ORDER BY date_created asc `
  ,function(error:any,results:any,fields:any){
    if(error)throw error;
    console.log(fields)
    res.json(results)
  })
})
router.put('/',(req:any,res:any)=>{
  if(!req.body.messenge){
    res.status(422).send('Missing param messenge');
    return
  }
  if(!req.body.noteID){
    res.status(422).send('Missing param noteID');
    return
  }
  mysqlConnection.query(`UPDATE Notes SET messenge = '${req.body.messenge}' WHERE ID = ${req.body.noteID}`
  ,function(error:any,results:any,fields:any){
    if(error)throw error;
    res.json(results)
  })
})
export default router
