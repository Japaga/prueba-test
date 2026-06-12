const sqlite3 = require('sqlite3').verbose();


// Crear o abrir la base de datos
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos', err.message);
    } else {
        console.log('Conectado a SQLite');

        db.run("PRAGMA foreign_keys = ON", (err) => {
            if (err) {
                console.error("Error activando foreign keys", err.message);
            }
        });
    }
});

module.exports = db;