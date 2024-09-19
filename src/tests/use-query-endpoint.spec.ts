import '@testing-library/jest-dom/vitest'
import { beforeEach, describe, it } from "vitest"
import { createUseQueryEndpoint } from '../utils/create-use-query-endpoint'

describe('useQueryEndpoint', () => {
    let useQueryEndpoint;

    beforeEach(() => {
        useQueryEndpoint = createUseQueryEndpoint({
            query: ''
        })    
    })

    it('returns endpoint data', () => {

    })

    it('does not make request when payload is null', () => {
        
    })

    it('updates query data', () => {
        
    })
})