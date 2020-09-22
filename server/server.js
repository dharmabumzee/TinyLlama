const express = require('express')
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express();
const port = process.env.PORT || 5001;

// app.use('/api', createProxyMiddleware({ target: 'https://tinyllama.dharmabumzee.vercel.app/', changeOrigin: true }));


app.use(morgan('tiny'));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes')(app);

app.get('/', cors(), function (req, res) {
  res.send('TinyLlama!')
})

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  })
}

app.use(notFound);
app.use(errorHandler);


app.use(express.static(path.join(__dirname, "build")));

app.get('/*', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(port);