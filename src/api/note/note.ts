import express,{Router} from 'express';
import {mysqlConnection} from '../../index';
const router = Router();
router.post('/',(req:any,res:any)=>{
  if(!req.body.text){
    res.status(422).send('Missing param text');
    return
  }
  if(!req.body.caseID){
    res.status(422).send('Missing param caseID');
    return
  }
})
export default router
