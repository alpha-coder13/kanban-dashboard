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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.getDb = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let db = null;
const getDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (db) {
        return db;
    }
    try {
        db = yield (0, sqlite_1.open)({
            filename: './db/dev-dashboard.db',
            driver: sqlite3_1.default.Database
        });
    }
    catch (e) {
        db = new sqlite_1.Database({
            filename: './db/dev-dashboard.db',
            driver: sqlite3_1.default.Database,
            mode: sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE,
        });
    }
    return db;
});
exports.getDb = getDb;
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, exports.getDb)();
    yield db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status INTEGER DEFAULT 1,
      priority STRING DEFAULT 'low', 
      due_date TIMESTAMP,
      assignee STRING,
      tags STRING
    )
  `);
    console.log('Database initialized');
});
exports.initDb = initDb;
