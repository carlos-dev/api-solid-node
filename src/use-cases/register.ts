import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { UsersRepository } from "../repositories/users-repository";
import { UsersAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UsersAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return {
      user,
    };
  }
}