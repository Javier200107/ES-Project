export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  nom: string;
  cognom: string;
  birthdate: string;
  is_admin: boolean;
}
