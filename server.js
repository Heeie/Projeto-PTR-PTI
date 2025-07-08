require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Rotas
const equipamentoRoutes = require('./routes/equipamento.routes');
const utilizadorRoutes = require('./routes/utilizadorRoutes');
const lojaRoutes = require('./routes/lojaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const transacoesRouter = require('./routes/transacaoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const avaliacaoRoutes = require('./routes/AvaliacoesRoutes');
const projetoBeneficenteRoutes = require('./routes/projetoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman etc.
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    } else {
      return callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
}));

// Sessões com replicação
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://10.0.2.8:27017,10.0.2.9:27017/sessoes?replicaSet=rs0',
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false, // true em produção com HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// Conteúdo estático
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

// Rotas
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api', utilizadorRoutes);
app.use('/api', catalogoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/projetos', projetoBeneficenteRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/transacoes', transacoesRouter);
app.use('/api/lojas', lojaRoutes);

// Verificação de sessão
app.get('/api/session', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true });
  } else {
    return res.json({ authenticated: false });
  }
});

// Erros globais
app.use((err, req, res, next) => {
  console.error('🔥 Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Mongo + índices
const Equipamento = require('./models/Equipamento');

mongoose.connect('mongodb://10.0.2.8:27017,10.0.2.9:27017/lojaVirtual?replicaSet=rs0')
  .then(() => {
    console.log('✔️ Conectado ao MongoDB com replicação!');
    Equipamento.syncIndexes()
      .then(() => console.log('✔️ Índices sincronizados com sucesso!'))
      .catch(err => console.error('❌ Erro ao sincronizar índices:', err.message));

    app.listen(PORT, () => {
      console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });
