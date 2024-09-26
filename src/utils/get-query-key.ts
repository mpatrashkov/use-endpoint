import { TypedDocumentNode } from "@graphql-typed-document-node/core";

export function getQueryKey<TData, TVariables>(
	document: TypedDocumentNode<TData, TVariables>,
	payload: TVariables,
) {
	const queryName = (document.definitions[0] as { name: { value: string } })
		.name.value;

	return payload ? [queryName, payload] : [queryName];
}
