module.exports = {
  // Para de executar os testes se encontrar um erro
  bail: true,
  coverageProvider: "v8",

  // Especifica quais arquivos de testes serão executados
  // dentro apenas da pasta src, evitando outras pastas
  // como o node_modules
  testMatch: ["<rootDir>/src/**/*.spec.js"],
}
