import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "schema/schema.graphql",
	documents: ["src/**/*.tsx"],
	ignoreNoDocuments: true,
	generates: {
		"./src/graphql/": {
			preset: "client",
		},
	},
};

export default config;
