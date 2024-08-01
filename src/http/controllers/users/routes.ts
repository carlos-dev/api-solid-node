import { FastifyInstance } from "fastify";

import { register } from "./register";
import { authenticate } from "./autenthicate";
import { profile } from "./profile";
import { refresh } from "./refresh";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authenticate);
  app.patch("/token/refresh", refresh);

  // authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
