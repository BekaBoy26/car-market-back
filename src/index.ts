import "dotenv/config";
import createApi from "./createApi";

const bootstrap = async () => {
  const server = await createApi();
  const port = Number(process.env.PORT) || 5000;

  server.listen(port, () => {
    console.log(`Server is on port ${port}`);
  });
};

bootstrap();;
