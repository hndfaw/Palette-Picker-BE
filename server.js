const app = require('./app')


app.set('port', process.env.PORT || 3001)

app.get('/', (req, res) => {
  res.send('This is paletter picker project')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on localhost:${app.get('port')}.`);
});

module.exports = app;