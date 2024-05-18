import test from "node:test";
import assert from "node:assert";
import { promisify } from "node:util";

test("Hero integration test suite", async (t) => {
  const testPort = 9009;
  process.env.PORT = testPort;

  const { server } = await import("../../src/index.js");
  const testServerAddress = `http://localhost:${testPort}/heroes`;

  await t.test("it should create a hero", async (t) => {
    const data = {
      name: "Flash",
      power: "Speed",
      age: 25,
    };

    const request = await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify(data),
    });

    assert.deepStrictEqual(
      request.headers.get("Content-Type"),
      "application/json"
    );
    assert.strictEqual(request.status, 201, "it should return status 201");
    const result = await request.json();

    assert.deepStrictEqual(
      result.success,
      "User created with success!!",
      "it should return a valid message"
    );
    assert.ok(result.id.length > 30, "it should return a valid uuid");
  });

  await promisify(server.close.bind(server))();
});
