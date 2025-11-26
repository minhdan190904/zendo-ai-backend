import { User } from "./Types.js";
export declare class AccountError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
/**
 * Represents user account
 */
export declare class Account {
    /**
     * Basic user account detail
     */
    user?: User;
    /**
     * Authentication token used for image generation
     */
    token?: string;
    /**
     * Expiry date for token (authentication token)
     */
    private tokenExpiry?;
    /**
     * User account cookie
     */
    private readonly cookie;
    constructor(cookie: string);
    /**
     * Re-generates and updates authorization token internally
     */
    refreshSession(): Promise<void>;
    /**
     * Check if current authorization token is expired (buffer: 30s)
     *
     * @returns Boolean representing if the token is expired
     */
    isTokenExpired(): boolean;
    /**
     * Returns headers object for authenticated requests.
     * You might not need this ever.
     *
     * @returns Headers of course
     */
    getAuthHeaders(): Headers;
    /**
     * Fetches session update request's json from labs.google
     *
     * @returns Promise containing `SessionData` object which contains account session info.
     */
    private fetchSession;
}
