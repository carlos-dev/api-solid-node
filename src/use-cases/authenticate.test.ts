import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("authenticate use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John",
      email: "carlos@gmail.com",
      password_hash: await hash("1234", 6),
    });

    const { user } = await sut.execute({
      email: "carlos@gmail.com",
      password: "1234",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const wrongEmail = "carlos5@gmail.com";
    await expect(() =>
      sut.execute({
        email: wrongEmail,
        password: "1234",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong pass", async () => {
    const wrongPass = "12344";
    await expect(() =>
      sut.execute({
        email: "carlos@gmail.com",
        password: wrongPass,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
