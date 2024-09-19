import { graphql, HttpResponse } from "msw";
import { Book } from "../../graphql/graphql";

export const exampleBooksResponse: Book[] = [
	{
		title: "example",
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
];
