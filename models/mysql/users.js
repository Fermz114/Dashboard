const { mysqlPool } = require('../../config/db');

class User {
    static async create({ username, email, password, role }) {
        const [result] = await mysqlPool.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role]
        );
        return result.insertId;
    }

    static async findByUsername(username) {
        const [rows] = await mysqlPool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }
}

module.exports = User;