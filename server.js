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
const transacoesRouter = require('./routes/transacaoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const avaliacaoRoutes = require('./routes/AvaliacoesRoutes');
const projetoBeneficenteRoutes = require('./routes/projetoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // Necessário para HTTPS + Secure cookies

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

// Sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_SESSION_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// CORS
app.use(cors({
  origin: 'https://www.grupomeu.com',
  credentials: true
}));

// Imagens públicas
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

// Rotas organizadas
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api', utilizadorRoutes);
app.use('/api/catalogos', catalogoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/projetos', projetoBeneficenteRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/transacoes', transacoesRouter);
app.use('/api/lojas', lojaRoutes);

// Verificação de sessão
app.get('/api/session', (req, res) => {
  res.json({ authenticated: !!req.session?.userId });
});

// Erros globais
app.use((err, req, res, next) => {
  console.error('🔥 Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Mongo + índices
const Equipamento = require('./models/Equipamento');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✔️ Conectado ao MongoDB com replicação!');
    return Equipamento.syncIndexes();
  })
  .then(() => {
    console.log('✔️ Índices sincronizados com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });
