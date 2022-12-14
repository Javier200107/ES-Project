export interface Post {
  id: number;
  text: string;
  time: string;
  archived: number;
  account_id: number;
  account_name: string;
  account_avatar: string;
  parent_id?: number;
  accounts_like:[];
  num_likes: number;
  num_comments: number;
  community: number;
  num_comments: number;
  image1: string;
  image2: string;
  video1: string;
}
