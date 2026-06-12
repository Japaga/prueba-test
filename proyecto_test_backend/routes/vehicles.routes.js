const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener Vehículos
router.get('/', (req, res) => {
    db.all("SELECT * FROM vehiculos", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.get('/:matricula', (req, res) => {
    const { matricula } = req.params;

    db.get("SELECT * FROM vehiculos WHERE matricula = ?", [matricula], (err, row) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }    
        if(!row) {
            return res.status(404).json({ error: "Vehículo no encontrado" });
        }
        res.json(row);
    });

});

router.post('/', (req, res) => {
    const v = req.body;

    if (!v.matricula || !v.marca) {
        return res.status(400).json({ error: "Datos obligatorios faltantes" });
    }

    const sql = `
    INSERT INTO vehiculos (
    matricula, marca, modelo, tipo_vehiculo, tipo_combustible,
    kilometros, fecha_ultima_revision, kilometros_ultima_revision,
    fecha_ultima_itv,fecha_ultima_tacografo, plazas_sentados, 
    plazas_sillas, numero_bastidor, fecha_matriculacion, centro_asignado
    
    ) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     `;

    const params = [
        v.matricula,
        v.marca,
        v.modelo,
        v.tipo_vehiculo,
        v.tipo_combustible,
        v.kilometros,
        v.fecha_ultima_revision,
        v.kilometros_ultima_revision,
        v.fecha_ultima_itv,
        v.fecha_ultima_tacografo,
        v.plazas_sentados,
        v.plazas_sillas,
        v.numero_bastidor,
        v.fecha_matriculacion,
        v.centro_asignado
        
    ];

    db.run(sql,params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ 
            message: "Vehículo creado correctamente",
            vehiculo: v});
    });
});

router.put('/:matricula', (req, res) => {
    const { matricula } = req.params;
    const v = req.body;

    if (!v.matricula || !v.marca || !v.modelo) {
        return res.status(400).json({ error: "Datos obligatorios faltantes" });
    }

    const sql = `
    UPDATE vehiculos SET
    marca = ?,
    modelo = ?,
    tipo_vehiculo = ?,
    tipo_combustible = ?,
    kilometros = ?,
    fecha_ultima_revision = ?,
    kilometros_ultima_revision = ?,
    fecha_ultima_itv = ?,
    fecha_ultima_tacografo = ?,
    plazas_sentados = ?,
    plazas_sillas = ?,
    numero_bastidor = ?,
    fecha_matriculacion = ?,
    centro_asignado = ?
    WHERE matricula = ?
    `;

    const params = [
        v.marca,
        v.modelo,
        v.tipo_vehiculo,
        v.tipo_combustible,
        v.kilometros,
        v.fecha_ultima_revision,
        v.kilometros_ultima_revision,
        v.fecha_ultima_itv,
        v.fecha_ultima_tacografo,
        v.plazas_sentados,
        v.plazas_sillas,
        v.numero_bastidor,
        v.fecha_matriculacion,
        v.centro_asignado,
        
        matricula
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if ( this.changes === 0) {
            return res.status(404).json({ error: "Vehículo no encontrado"});
        }

        res.json({ message: "Vehículo actualizado correctamente"});
    });
});

router.delete('/:matricula', (req, res) => {
    const { matricula } = req.params;
    
    db.run("DELETE FROM vehiculos WHERE matricula = ?", [matricula], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Vehículo no encontrado" });
        }

        res.json({ message: "Vehiculo eliminado correctamente" }); 
    });
});

module.exports = router;