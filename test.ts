import { getDb } from "./index.ts";

const db = getDb();
await db.load();
await db.migrations.load([
  {
    id: "2024-10-23-14:01",
    up: async ($db) => {},
    down: async ($db) => {},
  },
  {
    id: "2024-10-23-14:47",
    up: async ($db) => {},
    down: async ($db) => {},
  },
  {
    id: "2024-10-23-14:49",
    up: async ($db) => {
      throw "Something is bad here!";
    },
    down: async ($db) => {},
  },
]);
