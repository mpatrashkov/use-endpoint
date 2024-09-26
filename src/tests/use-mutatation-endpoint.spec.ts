import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { identity, Left, Right } from "purify-ts";
import { beforeEach, describe, expect, vi } from "vitest";
import { graphql } from "../graphql";
import { CreateBookMutationVariables } from "../graphql/graphql";
import { createUseEndpointFactory } from "../utils/create-use-endpoint-factory";
import { setupServerInVitest } from "./mocks/server";
import {
	reactQueryTest,
	ReactQueryTestContext,
} from "./utils/setup-react-query-wrapper";

const createUseCreateBookEndpoint = (queryClient: QueryClient) =>
	createUseEndpointFactory({
		baseUrl: "http://example.com",
		queryClient,
	}).createUseMutationEndpoint({
		document: graphql(`
			mutation CreateBook($title: String!) {
				addBook(title: $title) {
					title
				}
			}
		`),
		transform: (response) => response.addBook,
	});

describe("useMutationEndpoint", () => {
	let useCreateBook: ReturnType<typeof createUseCreateBookEndpoint>;

	setupServerInVitest();

	beforeEach<ReactQueryTestContext>(({ queryClient }) => {
		useCreateBook = createUseCreateBookEndpoint(queryClient);
	});

	describe("execute", () => {
		reactQueryTest("fails with Left", async ({ queryClient, wrapper }) => {
			const useCreateBookError = createUseEndpointFactory({
				baseUrl: "http://example.com",
				queryClient,
			}).createUseMutationEndpoint({
				document: graphql(`
					mutation CreateBookError($title: String!) {
						addBook(title: $title) {
							title
						}
					}
				`),
			});

			const { result } = renderHook(() => useCreateBookError(), {
				wrapper,
			});

			const payload: CreateBookMutationVariables = {
				title: "new book",
			};

			await waitFor(async () =>
				expect(
					await result.current
						.execute(payload)
						.mapLeft((e) => e.response.errors?.[0]),
				).toEqual(
					Left({
						message: "InternalServerError",
					}),
				),
			);
		});

		reactQueryTest("succeeds with Right", async ({ wrapper }) => {
			const { result } = renderHook(() => useCreateBook(), { wrapper });

			const payload: CreateBookMutationVariables = {
				title: "new book",
			};

			await waitFor(async () =>
				expect(await result.current.execute(payload)).toEqual(
					Right(payload),
				),
			);
		});
	});

	reactQueryTest(
		"calls onDidExecute after sending request",
		async ({ wrapper }) => {
			const { result } = renderHook(() => useCreateBook(), { wrapper });

			const onDidExecuteFn = vi.fn(identity);
			useCreateBook.onDidExecute(onDidExecuteFn);

			const payload: CreateBookMutationVariables = {
				title: "new book",
			};

			await waitFor(() => result.current.execute(payload));

			expect(onDidExecuteFn).toHaveBeenCalledWith(payload, payload);
		},
	);
});
