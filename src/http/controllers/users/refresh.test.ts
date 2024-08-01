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

    const authResponse = await request(app.server).post("/session").send({
      email: "carlos@gmail.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies ?? [])
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
