// src/serverFns/user.ts
import { createServerFn } from "@tanstack/react-start";

export const getUser = createServerFn().handler(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  console.log("Server function response:", data);
  return data;
});
