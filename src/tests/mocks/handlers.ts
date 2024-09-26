import { graphql, HttpResponse } from "msw";
import { Book } from "../../graphql/graphql";

export const exampleBooksResponse: Book[] = [
	{
		title: "example",
	},
];

export const exampleBooksResponse2: Book[] = [
	{
		title: "example2",
	},
];

export const handlers = [
	graphql.query("Books", () => {
		return HttpResponse.json({
			data: {
				books: exampleBooksResponse,
			},
		});
	}),
	graphql.mutation("CreateBook", ({ variables }) => {
		return HttpResponse.json({
			data: {
				addBook: variables,
			},
		});
	}),
	graphql.mutation("CreateBookError", () => {
		return HttpResponse.json({
			errors: [
				{
					message: "InternalServerError",
				},
			],
		});
	}),
];
