import { randomUUID } from "node:crypto";

import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    handler: (request, response) => {
      const { search } = request.query;
      const users = database.select(
        "users",
        search
          ? {
              email: search,
              name: search,
            }
          : null,
      );

      return response.end(JSON.stringify(users));
    },
    method: "GET",
    path: buildRoutePath("/users"),
  },
  {
    handler: (request, response) => {
      const { name, email } = request.body;

      const user = {
        email,
        id: randomUUID(),
        name,
      };

      database.insert("users", user);

      return response.writeHead(201).end();
    },
    method: "POST",
    path: buildRoutePath("/users"),
  },
  {
    handler: (request, response) => {
      const { id } = request.params;
      const { name, email } = request.body;

      database.update("users", id, {
        email,
        name,
      });
      return response.writeHead(204).end();
    },
    method: "PUT",
    path: buildRoutePath("/users/:id"),
  },
  {
    handler: (request, response) => {
      const { id } = request.params;

      database.delete("users", id);
      return response.writeHead(204).end();
    },
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
  },
];
