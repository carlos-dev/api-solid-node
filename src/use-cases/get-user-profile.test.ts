import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("get user use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to find user", async () => {
    const { id } = await usersRepository.create({
      name: "John",
      email: "carlos@gmail.com",
      password_hash: await hash("1234", 6),
    });

    const { user } = await sut.execute({ userId: id });

    expect(user.name).toEqual("John");
  });

  it("should not be able to get user profile with wrong id", async () => {
    expect(() =>
      sut.execute({
        userId: "not-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
