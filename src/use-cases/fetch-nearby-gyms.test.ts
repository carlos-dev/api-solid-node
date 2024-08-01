import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyUseCase;

describe("fetch nearby gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "near gym",
      latitude: -23.0251364,
      longitude: -43.4741091,
    });

    await gymsRepository.create({
      title: "far gym",
      latitude: -22.8889576,
      longitude: -43.2414165,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.0251364,
      userLongitude: -43.4741091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "near gym" })]);
  });
});
