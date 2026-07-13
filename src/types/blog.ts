export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string; // Markdown payload
  publishedAt: string;
  author: {
    name: string;
    avatarUrl: string;
    title: string;
  };
  coverImage: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
}
