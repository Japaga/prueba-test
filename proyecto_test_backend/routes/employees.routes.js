const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener Empleados
router.get('/', (req, res) => {
    db.all("SELECT * FROM empleados", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.get('/:dni', (req, res) => {
    
    const dni = req.params.dni;
    console.log(dni)
    db.get(`SELECT * FROM empleados where dni = "${dni}"`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if(!rows[0]){
          res.json({error: 'No existe un empleado con ese dni'})  
        }
        res.json(rows);
    });
});

router.post('/',(req,res) => {
    const e = req.body;
    db.run(
        `INSERT INTO empleados ( 
            dni,
            nombre,
            apellidos,
            fecha_nacimiento,            
            direccion,
            telefono,
            email,
            horas_diarias
        ) VALUES (?,?,?,?,?,?,?,?)`,
         [
        e.dni,
        e.nombre,
        e.apellidos,
        e.fecha_nacimiento,        
        e.direccion,
        e.telefono,
        e.email,
        e.horas_diarias
        ],
        function (err) {
            

            if (err && err.code === 'SQLITE_CONSTRAINT') {
                return res.status(409).json({ message: 'El DNI ya existe' });
            }
            if (err) {
                return res.status(500).json({error: err.message});
            }
            res.json({ id: this.lastID , message: 'Empleado creado correctamente'});

        }
    );
})

router.put('/:dni',(req, res) => {
    const dni = req.params.dni;
    const e = req.body;

    db.run(
      `UPDATE empleados SET
        nombre = ?,
        apellidos = ?,
        fecha_nacimiento = ?,        
        direccion = ?,
        telefono = ?,
        email = ?,
        horas_diarias = ?
      WHERE dni = ?`,
      [
        e.nombre,
        e.apellidos,
        e.fecha_nacimiento,        
        e.direccion,
        e.telefono,
        e.email,
        e.horas_diarias,
        dni
      ],
      function (err) {
        if (err) {
        return res.status(500).json({error: err.message});
      }
        if (this.changes === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      res.json({ message: 'Empleado actualizado correctamente'});
      }
    
    );

})

router.delete('/:dni',(req,res) => {
    const dni = req.params.dni;
    console.log(req.body)
    db.run(
        `DELETE FROM empleados WHERE dni = ?`,
        [dni],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Empleado no encontrado'});
            }
            res.json({ message: 'Empleado eliminado correctamente'});
        }
    )
})

module.exports = router;