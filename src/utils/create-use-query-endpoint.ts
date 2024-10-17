import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { request } from "graphql-request";
import { EndpointContext } from "./create-use-endpoint-factory";
import { getQueryKey } from "./get-query-key";

export interface CreateUseQueryEndpointOptions {
	staleAfterMs?: number | "never";
}

export interface CreateUseQueryEndpointConfig<TData, TVariables, TResult> {
	document: TypedDocumentNode<TData, TVariables>;
	transform?(data: TData): TResult;
	options?: CreateUseQueryEndpointOptions;
}

interface UseQueryEndpointMethods<TResult, TVariables> {
	setData(payload: TVariables, callback: (data?: TResult) => TResult): void;
	invalidate(payload: TVariables): void;
	getQueryObject(payload: TVariables): UseSuspenseQueryOptions<TResult>;
}

export interface UseQueryEndpoint<TResult, TVariables>
	extends UseQueryEndpointMethods<TResult, TVariables> {
	(payload: TVariables): {
		data: TResult;
	};
}

export function createUseQueryEndpoint<TData, TVariables, TResult>(
	context: EndpointContext,
	config: CreateUseQueryEndpointConfig<TData, TVariables, TResult>,
): UseQueryEndpoint<TResult, TVariables> {
	const methods: UseQueryEndpointMethods<TResult, TVariables> = {
		setData(payload: TVariables, callback) {
			context.queryClient.setQueryData(
				getQueryKey(config.document, payload),
				callback(
					context.queryClient.getQueryData(
						getQueryKey(config.document, payload),
					),
				),
			);
		},
		invalidate(payload: TVariables) {
			context.queryClient.invalidateQueries({
				exact: true,
				queryKey: getQueryKey(config.document, payload),
				refetchType: "active",
			});
		},
		getQueryObject(payload) {
			return {
				queryKey: getQueryKey(config.document, payload),
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
				staleTime:
					config.options?.staleAfterMs === "never"
						? Infinity
						: config.options?.staleAfterMs,
			};
		},
	};

	return Object.assign((payload: TVariables) => {
		return useSuspenseQuery(methods.getQueryObject(payload));
	}, methods);
}
