import * as express from 'express';
import userRouter from './api/user/user'
import caseRouter from './api/case/case'
import noteRouter from './api/note/note'
export const app = express();
import * as bodyParser from 'body-parser'
var mysql      = require('mysql');
app.use(bodyParser());
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'example',
  database: 'taxDB'
});
export const mysqlConnection = connection;
connection.connect();

connection.query('SELECT * FROM Users', function (error:any, results:any, fields:any) {
  if (error) throw error;
});

app.use('/user', userRouter);
app.use('/case', caseRouter);
app.use('/note', noteRouter);
if (process.env.NODE_ENV !== 'test') {
  app.listen(8001)
}
