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

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

// CORS deve vir ANTES de session
app.use(cors({
  origin: function (origin, callback) {

    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001', 'http://34.51.158.117:3000', 'https://grupomeu.com'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

//LOGIN
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
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

app.use('/api/categorias', categoriaRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api', lojaRoutes);



app.use('/api/transacoes', transacoesRouter); // <<<<<<<<<<


//app.use('/api/lojas', lojaRoutes);

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



// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr em https://34.51.158.117/api/${PORT}`);
  });
}).catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});
