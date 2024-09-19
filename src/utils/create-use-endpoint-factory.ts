import {
	createUseQueryEndpoint,
	CreateUseQueryEndpointConfig,
	CreateUseQueryEndpointContext,
} from "./create-use-query-endpoint";

export function createUseEndpointFactory(
	context: CreateUseQueryEndpointContext,
) {
	return <
		TData = unknown,
		TVariables = Record<string, unknown>,
		TResult = TData,
	>(
		config: CreateUseQueryEndpointConfig<TData, TVariables, TResult>,
	) => createUseQueryEndpoint(context, config);
}
