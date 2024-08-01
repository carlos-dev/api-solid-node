import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { app } from "../../../app";

describe("Authenticate e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "calors",
      email: "carlos@gmail.com",
      password: "123456",
    });

    const response = await request(app.server).post("/session").send({
      email: "carlos@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
