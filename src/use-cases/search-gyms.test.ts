import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("search gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able search a gym", async () => {
    await gymsRepository.create({
      title: "gym",
      latitude: -23.024293,
      longitude: -23.024293,
    });

    await gymsRepository.create({
      title: "myg-3",
      latitude: -23.024293,
      longitude: -23.024293,
    });
    const { gyms } = await sut.execute({ search: "gym", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "gym" })]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `gym ${index}`,
        latitude: -23.024293,
        longitude: -23.024293,
      });
    }

    const { gyms } = await sut.execute({ search: "gym", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "gym 21" }),
      expect.objectContaining({ title: "gym 22" }),
    ]);
  });
});
