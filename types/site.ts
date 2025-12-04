interface Site {
  name: string;
  description: string;
  url: string;
  friends: Array<{
    name: string;
    url: string;
  }>;
}
