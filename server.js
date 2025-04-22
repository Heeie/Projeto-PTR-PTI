require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const equipamentoRoutes = require('./routes/equipamento.routes');
const utilizadorRoutes = require('./routes/utilizadorRoutes');
const lojaRoutes = require('./routes/lojaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;




// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Servir arquivos estáticos (como imagens)
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

// Rotas da API
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api', utilizadorRoutes);
//app.use('/api/lojas', lojaRoutes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('🔥 Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});
