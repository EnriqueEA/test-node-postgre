const { Pool } = require('pg');

const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'db-clientes',
   password: '123456',
   port: 5432
});

const getCustomers = async (req, res) => {
   try {
      await pool.connect();
      const query = 'SELECT * FROM clientes';
      const result = await pool.query(query);
      res.status(200).json(result.rows);
   } catch (e) {
      console.log(e);
   }
}

const getCustomersById = async (req, res) => {
   try {
      await pool.connect();
      const query = 'SELECT * FROM clientes WHERE id = $1';
      const { uuid } = req.params;
      if ( uuid.length !== 36 ) {
         res.status(422).json({
            error: 'El id debe ser un UUID'
         });
         return;
      }
      const values = [uuid];
      const result = await pool.query(query, values);
      res.status(200).json(result.rows[0]);
   } catch (e) {
      res.status(422).json(e);
   }
}

const createCustomer = async (req, res) => {
   try {
      const query = 'SELECT * FROM public.insertar_cliente($1, $2, $3, $4, $5)';
      const values = [
         req.body.fname,
         req.body.lname,
         req.body.address,
         req.body.status,
         req.body.birthdate
      ];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
   } catch (e) {
      res.status(422).json(e);
   }
}

const updateCustomerById = async (req, res) => {
   try {
      const query = "CALL public.actualizar_cliente($1, $2, $3, $4, $5, $6)";
      const { uuid } = req.params;
      if ( uuid.length !== 36 ) {
         res.status(422).json({
            error: 'El id debe ser un UUID'
         });
         return;
      }
      const values = [
         uuid,
         req.body.fname,
         req.body.lname,
         req.body.address,
         req.body.status,
         req.body.birthdate
      ];
      await pool.query(query, values);
      res.status(200).json();
   } catch (e) {
      res.status(422).json(e);
   }
}

const deleteCustomer = async (req, res) => {
   try {
      const query = "CALL public.eliminar_cliente($1)";
      const { uuid } = req.params;
      if ( uuid.length !== 36 ) {
         res.status(422).json({
            error: 'El id debe ser un UUID'
         });
         return;
      }
      const values = [uuid];
      const result = await pool.query(query, values);
      res.status(204).json();
   } catch (e) {
      res.status(422).json(e);
   }
}

module.exports = {
   getCustomers,
   getCustomersById,
   createCustomer,
   updateCustomerById,
   deleteCustomer
}