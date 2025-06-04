const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Si la respuesta ya se ha enviado, delega a Express
  if (res.headersSent) {
    return next(err);
  }

  // Personalizar según tipo de error (detectar errores de Mongoose, validaciones, etc.)
  res.status(500).json({
    mensaje: 'Ocurrió un error en el servidor',
    detalle: err.message,
  });
};

module.exports = errorHandler;
