import express,{Router} from 'express';
import {mysqlConnection} from '../../index';
const router = Router();
router.post('/',(req:any,res:any)=>{
  if(!req.body.status){
    res.status(422).send('Missing param status')
    return
  }
  if(!req.body.country){
    res.status(422).send('Missing param country')
    return
  }
  if(!req.body.date_created){
    res.status(422).send('Missing param date_created')
    return
  }
  if(!req.body.clientId){
    res.status(422).send('Missing param clientId')
    return
  }

  if(!req.body.userId){
    res.status(422).send('Missing param userId')
    return
  }
  mysqlConnection.query(`INSERT INTO Cases
    (status,country,date_created,FK_Mongo_Client,FK_user)
    VALUES ('${req.body.status}','${req.body.country}',CURRENT_TIMESTAMP,'${req.body.clientId}','${req.body.userId}')
    `,function (error:any, results:any, fields:any) {
      if (error) throw error;
        res.status(200).send({id:results.insertId})
    })
})
router.get('/',async (req:any,res:any)=>{
  if(!req.body.page){
    res.status(422).send('Missing param page');
    return
  }
  await mysqlConnection.query('SELECT * FROM Cases',(error:any,results:any,fields:any)=>{
    if(error) throw error;
    res.send(results)
  })
})
export default router
