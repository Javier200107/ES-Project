export interface Post {
  id: number;
  text: string;
  time: string;
  archived: number;
  account_id: number;
  account_name: string;
  parent_id?: number;
  accounts_like:[];
  num_likes: number;
  community: number;
}
