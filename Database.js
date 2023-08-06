import mysql from 'mysql';

class Database {

    constructor() {
        this.conn = this.Connection();
        this.conn.connect((err) => {
            if (err) throw err;
            console.log('Connected!');
        });
    }

    Connection() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'nodejs'
        });
    }

    Insert(table, data) {
        let columns = Object.keys(data).join(',');
        let questionMarks = Object.keys(data).map((v) => '?').join(',');
        let sql = `INSERT INTO ${table}(${columns}) VALUES(${questionMarks})`;
        let values = Object.values(data);

        return new Promise((resolve, reject) => {
            this.conn.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    }

    Update(table, data, where) {
        let columns = Object.keys(data).map((v) => `${v} = ?`).join(',');
        let sql = `UPDATE ${table} SET ${columns} WHERE ?`;
        let values = Object.values(data);
        values.push(where);

        return new Promise((resolve, reject) => {
            this.conn.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });

    }

    Delete(table, where) {
        let sql = `DELETE FROM ${table} WHERE ?`;
        let values = [where];

        return new Promise((resolve, reject) => {
            this.conn.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });

    }

    Select(table, where = null, columns = '*') {
        let sql = `SELECT ${columns} FROM ${table}`;
        let values = null;

        if (where) {
            sql += ' WHERE ?';
            values = [where];
        }

        return new Promise((resolve, reject) => {
            this.conn.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    }

    CustomQuery(query) {
        return new Promise((resolve, reject) => {
            this.conn.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    }
}

export default Database;
