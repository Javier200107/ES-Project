export interface Post {
  id: number;
  text: string;
  time: string;
  archived: string;
  account_id: number;
  account_name: string;
  parent_id?: number
}
