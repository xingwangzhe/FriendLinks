export interface Site {
  name: string;
  description: string;
  url: string;
  favicon?: string;
  friends: Array<{
    name: string;
    url: string;
  }>;
}
