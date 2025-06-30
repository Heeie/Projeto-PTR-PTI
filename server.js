require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const equipamentoRoutes = require('./routes/equipamento.routes');
const utilizadorRoutes = require('./routes/utilizadorRoutes');
const lojaRoutes = require('./routes/lojaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const transacoesRouter = require('./routes/transacaoRoutes'); // exemplo do caminho
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


const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Permite Postman, etc.
    if (allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
}));


//LOGIN
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/sessoes',
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false, // true apenas se for HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// Servir arquivos estáticos (como imagens)
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));
// Rotas da API
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api', utilizadorRoutes);
app.use('/api', catalogoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/tipos', tipoRoutes);


app.use('/api/projetos', projetoBeneficenteRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/transacoes', transacoesRouter); // <<<<<<<<<<
app.listen(3000);
app.use('/api/lojas', lojaRoutes);


// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('🔥 Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const Equipamento = require('./models/Equipamento');

// Garante que os índices únicos estão aplicados
Equipamento.syncIndexes().then(() => {
  console.log('✔️ Índices sincronizados com sucesso!');
}).catch(err => {
  console.error('❌ Erro ao sincronizar índices:', err.message);
});


app.get('/api/session', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true });
  } else {
    return res.json({ authenticated: false });
  }
});

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017').then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});
