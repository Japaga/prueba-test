const db = require('../db/db.js');

function dropAllTables() {
    db.serialize(() => {
        db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(tables)
            tables.forEach((table) => {
                console.log(table)
                if (table.name !== 'sqlite_sequence') {
                    db.run(`DROP TABLE IF EXISTS ${table.name}`);
                }
            });
        });
    });
}

 dropAllTables();