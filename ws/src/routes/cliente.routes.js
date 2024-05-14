const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cliente = require('../models/cliente');
const ManicureCliente = require('../models/relationship/ManicureCliente');
const moment = require('moment');
const pagarme = require('../services/pagarme');
const uuid = require('uuid');


router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, manicureId } = req.body;
    let newCliente = null;

    const existentCliente = await Cliente.findOne({
      $or: [
        { email: cliente.email },
        { telefone: cliente.telefone },
        //{ cpf: colaborador.cpf },
      ],
    });

    if (!existentCliente) {
      const _id = new mongoose.Types.ObjectId();
      const cliente = req.body.cliente;

      // Gera um ID único para o cliente
      const customerId = uuid.v4();

      newCliente = await new Cliente({
        ...cliente,
        _id,
        customerId,
      }).save({ session });
    }

    const clienteId = existentCliente
      ? existentCliente._id
      : newCliente._id;

    
    // RELAÇÃO COM O SALÃO
    const existentRelationship = await ManicureCliente.findOne({
      manicureId,
      clienteId,
      status: { $ne: 'E' },
    });

    if (!existentRelationship) {
      await new ManicureCliente({
        manicureId,
        clienteId,
      }).save({ session });
    }

    if (existentCliente) {
        await ManicureColaborador.findOneAndUpdate(
            {
             manicureId,
             clienteId,
            },
            { status: 'A' },
            { session }
        );
    } 

    await session.commitTransaction();
    session.endSession();

    if (existentRelationship && existentCliente) {
      res.json({ error: true, message: 'Cliente já cadastrado!' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});



router.post('/filter', async (req, res) => {
    try {
      const clientes = await Cliente.find(req.body.filters);
      res.json({ error: false, clientes });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });


router.get('/manicure/:manicureId', async (req, res) => {
    try {
      const { manicureId } = req.params;
      let listaColaboradores = [];
  
      const clientes = await ManicureCliente.find({
        manicureId,
        status: { $ne: 'E' },
      })
        .populate('clienteId')
        .select('clienteId dataCadastro');
  
      res.json({
        error: false,
        clientes: clientes.map((vinculo) => ({
          ...vinculo.clienteId._doc,
          vinculoId: vinculo._id,
          dataCadastro: vinculo.dataCadastro,
        })),
      });
      //res.json({ error:false, listaColaboradores });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });


router.delete('/vinculo/:id', async (req, res) => {
    try {
      await ManicureCliente.findByIdAndUpdate(req.params.id, { status: 'E' });
      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });

module.exports = router;