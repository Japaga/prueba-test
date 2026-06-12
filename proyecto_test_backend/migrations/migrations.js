const db = require('../db/db.js');

function runMigrations() {
    db.serialize(() => {

        db.run(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS empleados (
                dni TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                apellidos TEXT NOT NULL,
                fecha_nacimiento TEXT,
                direccion TEXT,
                telefono TEXT,
                email TEXT UNIQUE,
                horas_diarias INTEGER     
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS vehiculos (
                matricula TEXT PRIMARY KEY,
                marca TEXT NOT NULL,
                modelo TEXT NOT NULL,
                tipo_vehiculo TEXT,
                tipo_combustible TEXT,
                kilometros INTEGER,
                fecha_ultima_revision TEXT,
                kilometros_ultima_revision INTEGER,
                fecha_ultima_itv TEXT,
                fecha_ultima_tacografo TEXT,
                plazas_sentados INTEGER,
                plazas_sillas INTEGER,
                numero_bastidor TEXT,
                fecha_matriculacion TEXT,
                centro_asignado TEXT   
                
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS transportes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                nombre TEXT UNIQUE,

                horario_inicio_manana TEXT,
                horario_fin_manana TEXT,

                horario_inicio_medio_dia TEXT,
                horario_fin_medio_dia TEXT,

                horario_inicio_tarde TEXT,
                horario_fin_tarde TEXT,

                horario_inicio_noche TEXT,
                horario_fin_noche TEXT,

                horario_inicio_madrugada TEXT,
                horario_fin_madrugada TEXT,
                
                vehiculo_asignado TEXT,
                empleado_asignado TEXT,

                FOREIGN KEY (vehiculo_asignado) REFERENCES vehiculos(matricula) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (empleado_asignado) REFERENCES empleados(dni) ON DELETE SET NULL ON UPDATE CASCADE
            )
        `);

        db.run(`
            CREATE INDEX IF NOT EXISTS idx_transportes_vehiculo
            ON transportes(vehiculo_asignado)
            `)

        db.run(`
            CREATE INDEX IF NOT EXISTS idx_transportes_empleado
            ON transportes(empleado_asignado)
            `)
    });
}

module.exports = runMigrations;