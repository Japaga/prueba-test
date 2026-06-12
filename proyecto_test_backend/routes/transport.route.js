const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener clientes
router.get('/', (req, res) => {

    db.all("SELECT * FROM transportes", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
            }

            const result = rows.map(t => ({
            id: t.id,
            nombre: t.nombre,
            vehiculoAsignado: t.vehiculo_asignado,
            empleadoAsignado: t.empleado_asignado,

            turnos: {
                Manana: {
                    inicio: t.horario_inicio_manana,
                    fin: t.horario_fin_manana
                },
                MedioDia: {
                    inicio: t.horario_inicio_medio_dia,
                    fin: t.horario_fin_medio_dia
                },
                Tarde: {
                    inicio: t.horario_inicio_tarde,
                    fin: t.horario_fin_tarde
                },
                Noche: {
                    inicio: t.horario_inicio_noche,
                    fin: t.horario_fin_noche
                },
                Madrugada: {
                    inicio: t.horario_inicio_madrugada,
                    fin: t.horario_fin_madrugada
                   }
                }
            }));

        res.json(result);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM transportes WHERE id = ?", [id],
        (err,row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

             if (!row) {
                return res.status(404).json({ error: 'Transporte no encontrado' });
            }

            res.json({
    id: row.id,
    nombre: row.nombre,
    vehiculoAsignado: row.vehiculo_asignado,
    empleadoAsignado: row.empleado_asignado,

    turnos: {
        Manana: {
            inicio: row.horario_inicio_manana,
            fin: row.horario_fin_manana
        },
        MedioDia: {
            inicio: row.horario_inicio_medio_dia,
            fin: row.horario_fin_medio_dia
        },
        Tarde: {
            inicio: row.horario_inicio_tarde,
            fin: row.horario_fin_tarde
        },
        Noche: {
            inicio: row.horario_inicio_noche,
            fin: row.horario_fin_noche
        },
        Madrugada: {
            inicio: row.horario_inicio_madrugada,
            fin: row.horario_fin_madrugada
        }
    }
});
        }
    );
});

router.post('/', (req,res) => {
    const t = req.body;
    const sql = `
    INSERT INTO transportes (
    
    nombre,

    horario_inicio_manana, horario_fin_manana,

    horario_inicio_medio_dia, horario_fin_medio_dia,

    horario_inicio_tarde, horario_fin_tarde,

    horario_inicio_noche, horario_fin_noche,

    horario_inicio_madrugada, horario_fin_madrugada,

    vehiculo_asignado,
    empleado_asignado    
    )

    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.run(
        sql, [
            t.nombre,

            t.horarioInicioManana,
            t.horarioFinManana,

            t.horarioInicioMedioDia,
            t.horarioFinMedioDia,

            t.horarioInicioTarde,
            t.horarioFinTarde,

            t.horarioInicioNoche,
            t.horarioFinNoche,

            t.horarioInicioMadrugada,
            t.horarioFinMadrugada,

            t.vehiculoAsignado,
            t.empleadoAsignado
        ],

        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id: this.lastID,
                message: 'Transporte creado'
            });
        }
    );
});

router.put('/:id', (req,res) => {
    const id = req.params.id;
    const t = req.body;
    const sql = `
    
    UPDATE transportes SET

        nombre = ?,

        horario_inicio_manana = ?,
        horario_fin_manana = ?,

        horario_inicio_medio_dia = ?,
        horario_fin_medio_dia = ?,

        horario_inicio_tarde = ?,
        horario_fin_tarde = ?,

        horario_inicio_noche = ?,
        horario_fin_noche = ?,

        horario_inicio_madrugada = ?,
        horario_fin_madrugada = ?,

        vehiculo_asignado = ?,
        empleado_asignado = ?

        WHERE id = ?

    `;

    db.run(
        sql, [
            t.nombre,

            t.horarioInicioManana,
            t.horarioFinManana,

            t.horarioInicioMedioDia,
            t.horarioFinMedioDia,

            t.horarioInicioTarde,
            t.horarioFinTarde,

            t.horarioInicioNoche,
            t.horarioFinNoche,

            t.horarioInicioMadrugada,
            t.horarioFinMadrugada,

            t.vehiculoAsignado,
            t.empleadoAsignado,

            id
        ],

        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                updated: this.changes,
                mensaje: 'Transporte actualizado'
            });            
        }
    );
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM transportes WHERE id = ?",
        [id],

        function(err){
            if(err){
                return res.status(500).json({ error: err.message });
            }
            res.json({
                deleted: this.changes,
                mensaje: 'Transporte eliminado'
            });
        }
    );

});


module.exports = router;