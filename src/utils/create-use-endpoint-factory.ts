import { QueryClient } from "@tanstack/react-query";
import {
	createUseQueryEndpoint,
	CreateUseQueryEndpointConfig,
} from "./create-use-query-endpoint";
import { createUseMutationEndpoint } from "./create-use-mutation-endpoint";

export interface EndpointContext {
	baseUrl: string;
	queryClient: QueryClient;
	useHeaders(): HeadersInit;
}

export function createUseEndpointFactory(context: EndpointContext) {
	const query = <
		TData = unknown,
		TVariables = Record<string, unknown>,
		TResult = TData,
	>(
		config: CreateUseQueryEndpointConfig<TData, TVariables, TResult>,
	) => createUseQueryEndpoint(context, config);

	const mutation = <
		TData = unknown,
		TVariables = Record<string, unknown>,
		TResult = TData,
	>(
		config: CreateUseQueryEndpointConfig<TData, TVariables, TResult>,
	) => createUseMutationEndpoint(context, config);

	return {
		createUseQueryEndpoint: query,
		createUseMutationEndpoint: mutation,
	};
}
