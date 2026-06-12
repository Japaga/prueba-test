const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener clientes
router.get('/', (req, res) => {
    db.all("SELECT * FROM clientes", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Crear cliente
router.post('/', (req, res) => {
    const { nombre, email } = req.body;

    db.run(
        "INSERT INTO clientes (nombre, email) VALUES (?, ?)",
        [nombre, email],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, nombre, email });
        }
    );
});

// ✅ Actualizar cliente
router.put('/:id', (req, res) => {
    const { nombre, email } = req.body;
    const { id } = req.params;

    db.run(
        "UPDATE clientes SET nombre = ?, email = ? WHERE id = ?",
        [nombre, email, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Cliente actualizado' });
        }
    );
});

// ✅ Eliminar cliente
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run(
        "DELETE FROM clientes WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Cliente eliminado' });
        }
    );
});

module.exports = router;