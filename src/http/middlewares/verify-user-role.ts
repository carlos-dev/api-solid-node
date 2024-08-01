import { Role } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";

export function verifyUserRole(roleToVerify: Role) {
  return async (request: FastifyRequest, response: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify)
      return response.status(401).send({ message: "Unauthorized" });
  };
}
