import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-numbers-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

const userMock = {
  gymId: "gym-1",
  userId: "user-1",
  userLatitude: -23.024293,
  userLongitude: -43.4785564,
};

describe("check in use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-1",
      title: "js gym",
      description: "",
      latitude: -23.024293,
      longitude: -23.024293,
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute(userMock);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute(userMock);

    await expect(() => sut.execute(userMock)).rejects.toBeInstanceOf(
      MaxNumberOfCheckInsError
    );
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute(userMock);

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute(userMock);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    // -23.024293,-43.4748484
    gymsRepository.items.push({
      id: "gym-2",
      title: "js gym",
      description: "",
      latitude: new Decimal(-23.024293),
      longitude: new Decimal(-43.4748484),
      phone: "",
    });

    // -23.0191615,-43.4785564
    await expect(() =>
      sut.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -23.0191615,
        userLongitude: -43.4785564,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
