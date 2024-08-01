import { PrismaGymsRepository } from "../../repositories/prisma/primsa-gyms-repository";
import { SearchGymsUseCase } from "../search-gyms";

export function makeSearchGymsUseCase() {
  const usersRepository = new PrismaGymsRepository();
  const useCase = new SearchGymsUseCase(usersRepository);

  return useCase;
}
