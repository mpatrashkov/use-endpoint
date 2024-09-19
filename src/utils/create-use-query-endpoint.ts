export interface CreateUseQueryEndpointOptions {
    staleAfterMs?: number | 'never'
}

export interface CreateUseQueryEndpointConfig {
    query: string;
    options?: CreateUseQueryEndpointOptions;
}

export function createUseQueryEndpoint(config: CreateUseQueryEndpointConfig) {

}