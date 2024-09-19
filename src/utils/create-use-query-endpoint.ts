import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

export interface CreateUseQueryEndpointOptions {
	staleAfterMs?: number | "never";
}

export interface CreateUseQueryEndpointConfig<TData, TVariables, TResult> {
	document: TypedDocumentNode<TData, TVariables>;
	transform?(data: TData): TResult;
	options?: CreateUseQueryEndpointOptions;
}

export interface CreateUseQueryEndpointContext {
	baseUrl: string;
	queryClient: QueryClient;
}

interface UseQueryEndpointMethods<TResult, TVariables> {
	setData(callback: (data?: TResult) => TResult): void;
}

export interface UseQueryEndpoint<TResult, TVariables>
	extends UseQueryEndpointMethods<TResult, TVariables> {
	(payload: TVariables): {
		data: TResult;
	};
}

export function createUseQueryEndpoint<TData, TVariables, TResult>(
	context: CreateUseQueryEndpointContext,
	config: CreateUseQueryEndpointConfig<TData, TVariables, TResult>,
): UseQueryEndpoint<TResult, TVariables> {
	const methods: UseQueryEndpointMethods<TResult, TVariables> = {
		setData(callback) {
			context.queryClient.setQueryData(
				["test"],
				callback(context.queryClient.getQueryData(["test"])),
			);
		},
	};

	return Object.assign((payload: TVariables) => {
		return useSuspenseQuery({
			queryKey: ["test"],
			queryFn: () =>
				request<TData>({
					url: context.baseUrl,
					document: config.document,
					// TODO: remove cast
					variables: payload as object,
				}).then((result) => {
					if (config.transform) {
						return config.transform(result);
					}

					// TODO: remove cast
					return result as unknown as TResult;
				}),
		});
	}, methods);
}
