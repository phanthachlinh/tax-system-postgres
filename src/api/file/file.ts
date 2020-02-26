import express, { Router } from 'express';
import { mysqlConnection } from '../../../index';
const path = require('path')
const multer = require('multer');
var filename = '';
const mimeTypeExtension: any = {
	"image/png": "png",
	"application/pdf": "pdf"
}
var storage = multer.diskStorage({
	destination: function(req: any, file: any, cb: any) {
		cb(null, path.join(__dirname, '../../uploads'))
	},
	filename: function(req: any, file: any, cb: any) {
		if (typeof file.mimetype === 'undefined') {
			cb(null, false)
		} else {
			console.log(file.originalname + '-' + Date.now() + '.' + mimeTypeExtension[(file.mimetype as string)])
			filename = file.originalname + '-' + Date.now() + '.' + mimeTypeExtension[(file.mimetype as string)]
			cb(null, filename)
		}
	}
})
function fileFilter(req: Request, file: any, cb: CallableFunction) {

	// The function should call `cb` with a boolean
	// to indicate if the file should be accepted
	if (typeof file.mimetype === 'undefined') {
		return cb(null, false)

	}
	if (!Object.keys(mimeTypeExtension).includes(file.mimetype)) {
		return cb(null, false);
	} else {
		return cb(null, true)
	}
	// To reject this file pass `false`, like so:


	// To accept the file pass `true`, like so:


	// You can always pass an error if something goes wrong:

}
var upload = multer({ storage: storage, fileFilter })
const router = Router();
router.post('/', upload.single('File'), (req: any, res: any) => {
	console.log(req.files)
	if (!req.body.FK_Mongo_Case) {
		res.status(422).send('Missing param FK_Case')
		return
	}
	if (!req.body.FK_User) {
		res.status(422).send('Missing param FK_User')
		return
	}
	if (typeof req.file.mimetype == 'undefined' || !Object.keys(mimeTypeExtension).includes(req.file.mimetype)) {
		res.status(422).send('Wrong filetype')
		return
	}
	mysqlConnection.query("INSERT INTO `Files` (`title`,`filename`,`FK_User`,`FK_Mongo_Case`,`date_created`) VALUES('" + req.body.title + "','" + req.file.filename + "','" + req.body.FK_User + "','" + req.body.FK_Mongo_Case + "',CURRENT_TIMESTAMP)", function(error: any, results: any, fields: any) {
		if (error) throw error;
		mysqlConnection.query(`SELECT * FROM Files WHERE ID= LAST_INSERT_ID()`
			, function(error: any, results: any, fields: any) {
				if (error) throw error;
				res.send(results[0])
			})
	})
})
router.use('/static', express.static(path.join(__dirname, '../../uploads')))
export default {
	// getClients: async (searchTerm: string, page: number) =>
	//
	// 	await Client.aggregate(getAggregations(searchTerm, page)).then((response: any, error: any) => {
	// 		return {
	// 			results: response[0].results,
	// 			count: response[0].count.length === 0 ? 0 : response[0].count[0].id
	// 		}
	// 	}),
	deleteFile: (ID: number) => {
		return new Promise(async (resolve: any, reject: any) => {
			console.log('ID', ID)
			mysqlConnection.query("DELETE FROM `taxDB`.`Files` WHERE ID='" + ID + "'", (error: any, results: any, fields: any) => {
				if (error) { throw error; reject() };
				console.log('result')
				console.log(results)
				resolve(true)
			})
		})
	},
	getFiles: (FK_Mongo_Case: string) => {
		return new Promise(async (resolve: any, reject: any) => {

			mysqlConnection.query("SELECT * FROM Files WHERE FK_Mongo_Case='" + FK_Mongo_Case + "' ORDER BY date_created asc", (error: any, results: any, fields: any) => {
				if (error) { throw error; reject() };
				console.log('result')
				console.log(results)
				resolve(results)
			})
		})
	},
	updateFile: (ID: number) => {
		return new Promise(async (resolve: any, reject: any) => {
			mysqlConnection.query("DELETE FROM Notes WHERE ID='" + ID + "'", (error: any, results: any, fields: any) => {
				if (error) { throw error; reject() };
				console.log(results)
				resolve(true)
			})
		})
	}
	// updateClient: async (_id: string, input: any) => {
	// 	if (input['date_of_birth'] === '')
	// 		delete input['date_of_birth']
	// 	Object.keys(input).map((key: string) => {
	// 		if (input[key] === 'undefined')
	// 			delete input[key]
	// 	})
	// 	console.log(input)
	// 	await Client.findOneAndUpdate({ _id }, { "$set": input }, { new: true }, (err: any) => { if (err) throw err })
	// 	return true
	// },
	// removeClient: async (_id: string) => {
	// 	await Client.findByIdAndRemove(_id, ((err: any) => {
	// 		if (err)
	// 			throw err
	// 	}))
	// 	return true
	// }
}
// router.delete('/', (req: any, res: any) => {
// 	if (!req.query.id) {
// 		res.status(422).send('Missing param id')
// 		return
// 	}
// 	mysqlConnection.query('DELETE FROM Files WHERE ID = ' + req.query.id + '', function(err: any, results: any, fields: any) {
// 		if (err) throw err
// 		res.sendStatus(200).send()
// 		//fs.unlink(path.join(__dirname,'../../uploads'+filename), ()=>{res.send({affectedRows:results.affectedRows})})
// 	})
// })
// router.get('/', (req: any, res: any) => {
// 	if (!req.query.page) {
// 		res.status(422).send("Missing param page");
// 		return
// 	}
// 	mysqlConnection.query('SELECT * FROM Files', function(err: any, results: any, fields: any) {
// 		if (err) throw err
// 		res.send(results)
// 	})
// })
// router.put('/', (req: any, res: any) => {
// 	if (!req.body.title) {
// 		res.status(422).send('Missing param title')
// 		return
// 	}
// 	if (!req.body.id) {
// 		res.status(422).send('Missing param id')
// 		return
// 	}
// 	mysqlConnection.query(`UPDATE Files SET title = '${req.body.title}' WHERE ID = ${req.body.id}`
// 		, function(error: any, results: any, fields: any) {
// 			if (error) throw error;
// 			res.json(results)
// 		})
// })
export const filerouter = router
