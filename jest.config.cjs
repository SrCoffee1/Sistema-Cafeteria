//jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom', // Configura o ambiente para jsdom
  testTimeout: 15000, // Define 15 segundos como timeout padrão para todos os testes
  transform: {
    "^.+\\.js$": "babel-jest", // Usando babel-jest para transpilar arquivos JS
  },
};
