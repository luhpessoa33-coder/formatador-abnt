const SiteSecurity = {
  publicAccess: true, // O site agora abre direto para todos
  requiresAuth: ["changeColors", "updateDatabase", "adminPanel"],
  
  checkAccess: function(action) {
    if (this.requiresAuth.includes(action)) {
      return this.promptSovereigntyKey(); // Só pede chave aqui
    }
    return true; // Acesso público liberado para o resto
  }
};
