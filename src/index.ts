import * as express from 'express';
import userRouter from './api/user/user'
import caseRouter from './api/case/case'
import noteRouter from './api/note/note'

import fileRouter from './api/file/file'
export const app = express();
import * as bodyParser from 'body-parser'
import path from 'path';
var cors = require('cors');
app.use(cors());
var mysql      = require('mysql');
app.use(bodyParser());
app.use('/file',bodyParser.urlencoded({ extended: true }));
app.use('/static',express.static(path.join(__dirname,'./uploads')))
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'example',
  database: 'taxDB'
});
export const mysqlConnection = connection;


app.use('/user', userRouter);
app.use('/case', caseRouter);
app.use('/note', noteRouter);
app.use('/file', fileRouter);
if (process.env.NODE_ENV !== 'test') {
  app.listen(8001)
}
