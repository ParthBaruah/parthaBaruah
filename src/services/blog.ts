import { BlogPost } from "@/types/blog";

// Static mock file system proxy repository containing structured markdown entries
const MOCK_BLOG_DATA: Record<string, BlogPost> = {
  "how-to-get-your-first-youtube-sponsor": {
    slug: "how-to-get-your-first-youtube-sponsor",
    title: "The Direct Outbound Playbook for Landing Your First YouTube Sponsor",
    description: "Learn how to structure metrics parameters, target decision-makers, and construct high-performance outreach copy.",
    content: `
## The Reality of Modern Channel Monetization

Many content creators mistakenly assume that you need hundreds of thousands of subscribers to secure profitable integration deals. This is factually incorrect. Brand managers are increasingly optimizing capital away from superficial vanity metrics and diverting budgets toward highly isolated niche conversion metrics.

### Step 1: Isolate Your Actual Core Demographics
Before querying database tables or sending raw cold outreach emails, map out your demographic indexes precisely:
* Viewer age distributions
* Geographic concentrations
* High-intent purchase alignments

### Step 2: Formulate the Inbound Hook Proposal
When drafting outbound communication assets, bypass generic support contact channels. Locate specific Marketing Managers on professional discovery indexes. Frame your outreach copy around clear performance outcomes rather than empty aesthetic claims.

### Step 3: Standardize the Contract Lifecycles
Ensure every agreement defines exact usage terms, validation timelines, revision limits, and explicit payment milestone completions.
    `,
    publishedAt: "2026-07-10T10:00:00Z",
    author: {
      name: "Alex Mercer",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      title: "Head of Creator Strategy"
    },
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    category: "Outreach Tactics",
    tags: ["Sponsorships", "Monetization", "Cold Email"],
    readingTimeMinutes: 4,
  }
};

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = MOCK_BLOG_DATA[slug];
  if (!post) return null;
  return post;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return Object.values(MOCK_BLOG_DATA).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
