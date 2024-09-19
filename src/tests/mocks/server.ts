import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

export function setupServerInVitest() {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());
}

// server.listen();

// fetch("https://rickandmortyapi.com/graphql", {
// 	method: "POST",

// 	headers: {
// 		"Content-Type": "application/json",
// 	},

// 	body: JSON.stringify({
// 		query: `
//         query Books {
//           books {
//             title
//           }
//         }
//       `,
// 	}),
// });
