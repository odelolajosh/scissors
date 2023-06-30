import app from "./src/app";

const PORT = parseInt(process.env.PORT) || 5001;
// const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();