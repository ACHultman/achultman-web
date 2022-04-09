export type Tag = string;
export interface Bookmark {
  id?: number;
  title: string;
  domain: string;
  description: string;
  url: string;
  image: string;
  tags: Tag[];
}
