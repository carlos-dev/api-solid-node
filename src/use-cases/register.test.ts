import { expect, describe, it, beforeAll, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UsersAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should hash user password upon registration", async () => {
    const password = "1234";
    const { user } = await sut.execute({
      name: "John",
      email: "carlos@gmail.com",
      password,
    });

    const isPasswordCorrectlyHashed = await compare("1234", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
    console.log(user.password_hash);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "carlos@gmail.com";
    await sut.execute({
      name: "John",
      email,
      password: "1234",
    });

    await expect(() =>
      sut.execute({
        name: "John",
        email,
        password: "1234",
      })
    ).rejects.toBeInstanceOf(UsersAlreadyExistsError);
  });

  it("should be able to register", async () => {
    const email = "carlos@gmail.com";

    const { user } = await sut.execute({
      name: "John",
      email,
      password: "1234",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
