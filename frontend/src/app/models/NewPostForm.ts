export interface NewPostForm {
  text: string;
  parent_id?: number;
  post_file?: File | null;
}
