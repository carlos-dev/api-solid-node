import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("register use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be create gym", async () => {
    const { gym } = await sut.execute({
      title: "data.title",
      latitude: -23.024293,
      longitude: -23.024293,
      phone: "",
      description: "",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
