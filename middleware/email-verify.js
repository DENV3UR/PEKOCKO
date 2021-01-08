module.exports = (req, res, next) => {
  try {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(req.body.email)) {
      throw 'Invalid email';
    } else {
      next();
    }
  } catch {
    res.status(400).json({
      error: new Error('Invalid request!')
    });
  }
};