import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createUseMutationEndpoint } from "../utils/create-use-mutation-endpoint";

describe.skip("useMutationEndpoint", () => {
	let useMutationEndpoint: UseMutationEndpoint<>;

	beforeEach(() => {
		useMutationEndpoint = createUseMutationEndpoint({
			mutation: `
                mutataion Test {
                }
            `,
		});
	});

	it("sends endpoint data", () => {});

	it("calls onDidExecute after sending request", async () => {
		const { result } = renderHook(() => useMutationEndpoint());

		const payload = {
			id: 10,
		};

		await waitFor(() => result.current.execute(payload));

		expect(result.current.onDidExecute).toHaveBeenCalledWith(
			{
				ok: true,
			},
			payload,
		);
	});
});
