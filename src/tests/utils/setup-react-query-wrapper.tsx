import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren, Suspense } from "react";
import { test } from "vitest";

export interface ReactQueryTestContext {
	queryClient: QueryClient;
	wrapper: React.FC;
}

export const reactQueryTest = test.extend<ReactQueryTestContext>({
	// eslint-disable-next-line no-empty-pattern
	queryClient: async ({}, applyFixture) => {
		const queryClient = new QueryClient();
		await applyFixture(queryClient);
	},
	wrapper: async ({ queryClient }, applyFixture) => {
		const wrapper = ({ children }: PropsWithChildren) => (
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={<div></div>}>{children}</Suspense>
			</QueryClientProvider>
		);

		await applyFixture(wrapper);
	},
});
