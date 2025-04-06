export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface LoginResponseDTO {
    id: string;
    email: string;
    fullName: string;
    token: string;
    expiresIn: number;
  }