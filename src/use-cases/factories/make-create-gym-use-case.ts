import { PrismaGymsRepository } from "../../repositories/prisma/primsa-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const usersRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(usersRepository);

  return useCase;
}
