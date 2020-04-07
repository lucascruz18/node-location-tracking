const App = require('./app');

App.listen(process.env.PORT || 3333, () => {
  console.log('🚀  Server running');
});
