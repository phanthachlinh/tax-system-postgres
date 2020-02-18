import express,{Router} from 'express';
import {mysqlConnection} from '../../index';
const router = Router();
router.post('/',(req:any,res:any)=>{
  console.log(req.body)
  if(typeof req.body.status === 'undefined'){
    res.status(422).send('Missing param status')
    return
  }
  if(!req.body.country){
    res.status(422).send('Missing param country')
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
    VALUES ('${req.body.status}','${JSON.stringify(req.body.country)}',CURRENT_TIMESTAMP,'${req.body.clientId}','${req.body.userId}')
    `,function (error:any, results:any, fields:any) {
      if (error) throw error;
        res.status(200).send({id:results.insertId})
    })
})
router.get('/',(req:any,res:any)=>{
  let page = parseInt(req.query.page)
  console.log(page)
  if(!typeof page == undefined){
    res.status(422).send('Missing param page');
    return
  }
  mysqlConnection.query('SELECT * FROM Cases ORDER BY date_created desc LIMIT 5 OFFSET '+page+'',(error:any,results:any,fields:any)=>{
    if(error) throw error;
    console.log(results)
    res.send(results)
  })
})
router.delete('/',(req:any,res:any)=>{
  console.log(req.body)
  if(!req.body.id){
    res.status(422).send('Missing param id');
    return
  }
  mysqlConnection.query('DELETE FROM Cases WHERE ID = '+req.body.id+'',(error:any,results:any,fields:any)=>{
    if(error) throw error;
    res.send(results)
  })
})
router.put('/',(req:any,res:any)=>{
  if(!req.body.id){
    res.status(422).send('Missing param id');
    return
  }
  if(!req.body.status){
    res.status(422).send('Missing param status');
    return
  }
  if(!req.body.country){
    res.status(422).send('Missing param country');
    return
  }
  mysqlConnection.query("UPDATE Cases SET status = '"+req.body.status+"', country = '"+req.body.country+"'  WHERE ID = "+req.body.id+"",(error:any,results:any,fields:any)=>{
    if(error) throw error;
    res.send(results)
  })
})
export default router
