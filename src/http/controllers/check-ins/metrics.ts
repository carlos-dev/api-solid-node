import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetUserMetricsUseCase } from "../../../use-cases/factories/make-get-user-metrics-use-case";

export async function metrics(request: FastifyRequest, response: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkIns } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  });

  console.log("check ins", checkIns);
  console.log("request.user.sub", request.user.sub);

  return response.status(200).send({
    checkIns,
  });
}
