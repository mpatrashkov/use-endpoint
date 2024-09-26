import "@testing-library/jest-dom/vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import { Book } from "../graphql/graphql";
import { createUseEndpointFactory } from "../utils/create-use-endpoint-factory";
import { exampleBooksResponse, exampleBooksResponse2 } from "./mocks/handlers";
import { setupServerInVitest } from "./mocks/server";
import {
	reactQueryTest,
	ReactQueryTestContext,
} from "./utils/setup-react-query-wrapper";
import { QueryClient } from "@tanstack/react-query";
import { graphql } from "../graphql";

const createUseBooksEndpoint = (queryClient: QueryClient) =>
	createUseEndpointFactory({
		baseUrl: "http://example.com",
		queryClient,
	}).createUseQueryEndpoint({
		document: graphql(`
			query Books {
				books {
					title
				}
			}
		`),
		transform: (response) => response.books,
	});

describe("useQueryEndpoint", () => {
	setupServerInVitest();

	let useBooks: ReturnType<typeof createUseBooksEndpoint>;

	beforeEach<ReactQueryTestContext>(({ queryClient }) => {
		useBooks = createUseBooksEndpoint(queryClient);
	});

	reactQueryTest("returns endpoint data", async ({ wrapper }) => {
		const { result } = renderHook(() => useBooks({}), { wrapper });

		await waitFor(() => {
			expect(result.current.data).toEqual(exampleBooksResponse);
		});
	});

	reactQueryTest("refetch data on invalidate", async ({ wrapper }) => {
		await act(() => useBooks.setData({}, () => exampleBooksResponse2));

		const { result } = renderHook(() => useBooks({}), { wrapper });

		await waitFor(() => {
			expect(result.current.data).toEqual(exampleBooksResponse2);
		});

		await act(() => useBooks.invalidate({}));

		await waitFor(() => {
			expect(result.current.data).toEqual(exampleBooksResponse);
		});
	});

	describe("setData", async () => {
		reactQueryTest("updates query data", async ({ wrapper }) => {
			const { result } = renderHook(() => useBooks({}), { wrapper });

			await waitFor(() => {
				expect(result.current.data).toEqual(exampleBooksResponse);
			});

			const mapBooks = (books: Book[]) =>
				books.map((book) => ({ ...book, title: "new title" }));

			await act(() =>
				useBooks.setData({}, () => [{ title: "new title" }]),
			);

			await waitFor(() =>
				expect(result.current.data).toEqual(
					mapBooks(exampleBooksResponse),
				),
			);
		});

		reactQueryTest("called with no data", async () => {
			await act(() => useBooks.setData({}, () => [{ title: "test" }]));
			// const { result } = renderHook(() => useBooks({}), { wrapper });
			// await waitFor(() =>
			// 	expect(result.current.data).toEqual([{ title: "test" }]),
			// );

			// await waitFor(() =>
			// 	expect(result.current.data).toEqual(exampleBooksResponse),
			// );
		});
	});
});
