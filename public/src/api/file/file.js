"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var index_1 = require("../../../index");
var path = require('path');
var multer = require('multer');
var filename = '';
var mimeTypeExtension = {
    "image/png": "png",
    "application/pdf": "pdf"
};
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        if (typeof file.mimetype === 'undefined') {
            cb(null, false);
        }
        else {
            console.log(file.originalname + '-' + Date.now() + '.' + mimeTypeExtension[file.mimetype]);
            filename = file.originalname + '-' + Date.now() + '.' + mimeTypeExtension[file.mimetype];
            cb(null, filename);
        }
    }
});
function fileFilter(req, file, cb) {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if (typeof file.mimetype === 'undefined') {
        return cb(null, false);
    }
    if (!Object.keys(mimeTypeExtension).includes(file.mimetype)) {
        return cb(null, false);
    }
    else {
        return cb(null, true);
    }
    // To reject this file pass `false`, like so:
    // To accept the file pass `true`, like so:
    // You can always pass an error if something goes wrong:
}
var upload = multer({ storage: storage, fileFilter: fileFilter });
var router = express_1.Router();
router.post('/', upload.single('File'), function (req, res) {
    console.log(req.files);
    if (!req.body.FK_Mongo_Case) {
        res.status(422).send('Missing param FK_Case');
        return;
    }
    if (!req.body.FK_User) {
        res.status(422).send('Missing param FK_User');
        return;
    }
    if (typeof req.file.mimetype == 'undefined' || !Object.keys(mimeTypeExtension).includes(req.file.mimetype)) {
        res.status(422).send('Wrong filetype');
        return;
    }
    index_1.mysqlConnection.query("INSERT INTO `Files` (`title`,`filename`,`FK_User`,`FK_Mongo_Case`,`date_created`) VALUES('" + req.body.title + "','" + req.file.filename + "','" + req.body.FK_User + "','" + req.body.FK_Mongo_Case + "',CURRENT_TIMESTAMP)", function (error, results, fields) {
        if (error)
            throw error;
        index_1.mysqlConnection.query("SELECT * FROM Files WHERE ID= LAST_INSERT_ID()", function (error, results, fields) {
            if (error)
                throw error;
            res.send(results[0]);
        });
    });
});
router.use('/static', express_1.default.static(path.join(__dirname, '../../uploads')));
exports.default = {
    // getClients: async (searchTerm: string, page: number) =>
    //
    // 	await Client.aggregate(getAggregations(searchTerm, page)).then((response: any, error: any) => {
    // 		return {
    // 			results: response[0].results,
    // 			count: response[0].count.length === 0 ? 0 : response[0].count[0].id
    // 		}
    // 	}),
    deleteFile: function (ID) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('ID', ID);
                index_1.mysqlConnection.query("DELETE FROM `taxDB`.`Files` WHERE ID='" + ID + "'", function (error, results, fields) {
                    if (error) {
                        throw error;
                        reject();
                    }
                    ;
                    console.log('result');
                    console.log(results);
                    resolve(true);
                });
                return [2 /*return*/];
            });
        }); });
    },
    getFiles: function (FK_Mongo_Case) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                index_1.mysqlConnection.query("SELECT * FROM Files WHERE FK_Mongo_Case='" + FK_Mongo_Case + "' ORDER BY date_created asc", function (error, results, fields) {
                    if (error) {
                        throw error;
                        reject();
                    }
                    ;
                    console.log('result');
                    console.log(results);
                    resolve(results);
                });
                return [2 /*return*/];
            });
        }); });
    },
    updateFile: function (ID) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                index_1.mysqlConnection.query("DELETE FROM Notes WHERE ID='" + ID + "'", function (error, results, fields) {
                    if (error) {
                        throw error;
                        reject();
                    }
                    ;
                    console.log(results);
                    resolve(true);
                });
                return [2 /*return*/];
            });
        }); });
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
};
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
exports.filerouter = router;
