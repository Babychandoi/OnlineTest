
export interface Login {
    email: string;
    password: string;
}
export interface LoginResponse {
    token : string;
    refreshToken : string;
}
export interface LogoutRequest{
    token : string;
}