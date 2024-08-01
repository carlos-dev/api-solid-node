import { PrismaGymsRepository } from "../../repositories/prisma/primsa-gyms-repository";
import { FetchNearbyUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymsUseCase() {
  const usersRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyUseCase(usersRepository);

  return useCase;
}
