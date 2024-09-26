import { useMutation } from "@tanstack/react-query";
import request, { ClientError } from "graphql-request";
import { TypedDocumentNode } from "msw/core/graphql";
import { EitherAsync, Left, Right } from "purify-ts";
import { EndpointContext } from "./create-use-endpoint-factory";

export interface CreateUseMutationEndpointConfig<TData, TVariables, TResult> {
	document: TypedDocumentNode<TData, TVariables>;
	transform?(data: TData): TResult;
}

interface OnDidExecuteCallback<TResult, TVariables> {
	(result: TResult, payload: TVariables): void;
}

interface UseMutationEndpointMethods<TResult, TVariables> {
	onDidExecute(callback: OnDidExecuteCallback<TResult, TVariables>): void;
}

interface UseMutationEndpointFunction<TResult, TVariables> {
	(): {
		execute: (payload: TVariables) => EitherAsync<ClientError, TResult>;
	};
}

export interface UseMutationEndpoint<TResult, TVariables>
	extends UseMutationEndpointMethods<TResult, TVariables>,
		UseMutationEndpointFunction<TResult, TVariables> {}

export function createUseMutationEndpoint<TData, TVariables, TResult>(
	context: EndpointContext,
	config: CreateUseMutationEndpointConfig<TData, TVariables, TResult>,
): UseMutationEndpoint<TResult, TVariables> {
	const onDidExecuteCallbacks: OnDidExecuteCallback<TResult, TVariables>[] =
		[];

	const methods: UseMutationEndpointMethods<TResult, TVariables> = {
		onDidExecute(callback: OnDidExecuteCallback<TResult, TVariables>) {
			onDidExecuteCallbacks.push(callback);
		},
	};

	const useMutationEndpoint: UseMutationEndpointFunction<
		TResult,
		TVariables
	> = () => {
		const mutation = useMutation({
			mutationFn: (payload: TVariables) =>
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
			onSuccess(result, payload) {
				for (const onDidExecuteCallback of onDidExecuteCallbacks) {
					onDidExecuteCallback(result, payload);
				}
			},
		});

		return {
			execute: (payload: TVariables) =>
				EitherAsync(async ({ liftEither }) => {
					try {
						return liftEither(
							Right(await mutation.mutateAsync(payload)),
						);
					} catch (error: unknown) {
						if (error instanceof ClientError) {
							return liftEither(Left(error));
						}

						// If the error does not come from GraphQL throw it for now
						throw error;
					}
				}),
		};
	};

	return Object.assign(useMutationEndpoint, methods);
}
