import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "schema/schema.graphql",
	documents: ["src/**/*.tsx", "src/**/*.ts"],
	ignoreNoDocuments: true,
	generates: {
		"./src/graphql/": {
			preset: "client",
		},
	},
};

export default config;
