module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.user = { id: req.session.userId };  // adiciona para facilitar o acesso
    next();
  } else {
    res.status(401).json({ mensagem: 'Não autenticado' });
  }
};
