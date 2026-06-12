const express = require('express');
const app = express();
const db = require('./db/db.js');
const runMigrations = require('./migrations/migrations.js');
const cors = require('cors');

app.use(express.json());
app.use(cors());
// Ruta principal
app.get('/', (req, res) => {
  res.send('Hola mundo');
});

const clientesRoutes = require('./routes/clients.routes.js');
app.use('/clientes', clientesRoutes);

const empleadosRoutes = require('./routes/employees.routes.js');
app.use('/empleados', empleadosRoutes);

const vehiculosRoutes = require('./routes/vehicles.routes.js');
app.use('/vehiculos', vehiculosRoutes);

const transportesRoutes = require('./routes/transport.route.js');
app.use('/transportes', transportesRoutes);

runMigrations();

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});