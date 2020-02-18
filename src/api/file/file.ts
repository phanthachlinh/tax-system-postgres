import express,{Router} from 'express';
import {mysqlConnection} from '../../index';
const path = require('path')
const multer = require('multer');
var filename = '';
const mimeTypeExtension:any ={
  "image/png":"png",
  "application/pdf":"pdf"
}
var storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
    console.log(__dirname);
    cb(null, path.join(__dirname,'../../uploads'))
  },
  filename: function (req:any, file:any, cb:any) {
    console.log(file)
    filename = file.originalname + '-' +Date.now()+'.'+mimeTypeExtension[(file.mimetype as string)]
    cb(null, filename)
  }
})

var upload = multer({ storage: storage })
const router = Router();
router.post('/',upload.single('File'),(req:any,res:any)=>{
  console.log(req.file)
  if(!req.body.FK_Mongo_Case){
    res.status(422).send('Missing param FK_Case')
    return
  }
  if(!req.body.FK_User){
    res.status(422).send('Missing param FK_User')
    return
  }

  console.log('fuck');console.log(filename);
  mysqlConnection.query("INSERT INTO `Files` (`title`,`filename`,`FK_User`,`FK_Mongo_Case`,`date_created`) VALUES('"+req.body.title+"','"+req.file.filename+"','"+req.body.FK_User+"','"+req.body.FK_Mongo_Case+"',CURRENT_TIMESTAMP)",function (error:any, results:any, fields:any) {
    if (error) throw error;
    mysqlConnection.query(`SELECT * FROM Files WHERE ID= LAST_INSERT_ID()`
      ,function(error:any,results:any,fields:any){
        if(error)throw error;
        console.log(results)
        res.send(results[0])
    })
    })
})
router.delete('/',(req:any,res:any)=>{
  console.log(req.query)
  if(!req.query.id){
    res.status(422).send('Missing param id')
    return
  }
  mysqlConnection.query('DELETE FROM Files WHERE ID = '+req.query.id+'',function(err:any,results:any,fields:any){
    if (err) throw err
    res.send(200)
    //fs.unlink(path.join(__dirname,'../../uploads'+filename), ()=>{res.send({affectedRows:results.affectedRows})})
  })
})
router.get('/',(req:any,res:any)=>{

  mysqlConnection.query('SELECT * FROM Files',function(err:any,results:any,fields:any){
    if (err) throw err
    res.send(results)
  })
})
router.put('/',(req:any,res:any)=>{
  mysqlConnection.query(`UPDATE Files SET title = '${req.body.title}' WHERE ID = ${req.body.id}`
  ,function(error:any,results:any,fields:any){
    if(error)throw error;
    res.json(results)
  })
})
export default router
