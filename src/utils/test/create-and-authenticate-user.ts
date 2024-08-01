import { FastifyInstance } from "fastify";
import request from "supertest";

import { prisma } from "../../lib/prisma";
import { hash } from "bcryptjs";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  const user = await prisma.user.create({
    data: {
      name: "carlos",
      email: "carlos@gmail.com",
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });
  await request(app.server).post("/users").send({
    name: "calors",
    email: "carlos@gmail.com",
    password: "123456",
  });

  const authResponse = await request(app.server).post("/session").send({
    email: "carlos@gmail.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return {
    token,
  };
}
