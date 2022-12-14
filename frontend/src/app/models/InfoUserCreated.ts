export interface InfoUserCreated {
  id?: number;
  username: string;
  password: string;
  email: string;
  nom: string;
  cognom: string;
  birthdate: string;
  is_admin: boolean;
  description: string;
  avatar: string;
  banner: string;
  followers: [];
  following: [];
}
