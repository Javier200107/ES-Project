export interface InfoUserCreated {
  id?: number;
  username: string;
  email: string;
  password: string;
  nom: string;
  cognom: string;
  birth: string;
  is_admin: boolean;
  "followers": [];
  "following": [];
}
