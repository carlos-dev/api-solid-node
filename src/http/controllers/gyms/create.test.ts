import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";

describe("Create Gym e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to create gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "js gym",
        description: "some",
        phone: "21493049534",
        latitude: -23.0251364,
        longitude: -43.4741091,
      });

    expect(response.statusCode).toEqual(201);
  });
});
