/**
 * Represents a user.
 */
export interface User {
    /** The unique identifier of the user. */
    id: number;
    /** The username of the user. */
    username: string;
    /** The email of the user. */
    email: string;
    /** The first name of the user. */
    firstName: string;
    /** The last name of the user. */
    lastName: string;
    /** The gender of the user. */
    gender: string;
    /** The profile image URL of the user. */
    image: string;
    /** The access token for authentication. */
    accessToken: string;
    /** The refresh token for authentication. */
    refreshToken: string;
}