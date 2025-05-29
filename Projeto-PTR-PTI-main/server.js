require('dotenv').config(); // Carregar variáveis de ambiente

//const connectDB = require('./config/db'); // Caminho para o arquivo de conexão



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importação de rotas
const equipamentoRoutes = require('./routes/equipamento.routes');
const utilizadorRoutes = require('./routes/utilizadorRoutes');
const lojaRoutes = require('./routes/lojaRoutes');

const app = express();




// Conectar ao MongoDB
//connectDB();



// 🔐 Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet()); // Segurança extra
app.use(morgan('dev')); // Logs no console

// 📌 Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });


// 📌 Rotas
app.use('/api/', equipamentoRoutes);
app.use('/api/', utilizadorRoutes);
//app.use('/api/lojas', lojaRoutes);

// 📌 Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('🔥 Erro interno:', err.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// 🔥 Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
