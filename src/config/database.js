const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://brianarruk22:W3jnGEl0c6AYsqmz@cluster0.1ldfa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1); // Finaliza a aplicação se não conectar
  }
};

module.exports = connectDB