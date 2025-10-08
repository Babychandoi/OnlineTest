export interface ApiResponse<T> {
  code : number;
  message : string;
  data : T;
}
export interface ApiResponse <T> {
    code: number;
    message: string;
    data: T;
}
export interface IntrospectResponse {
    valid : boolean;
}