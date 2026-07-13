import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/services/blog";
import { Clock, Calendar, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic search metadata blocks
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | SponsorVault Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // JSON-LD Schema.org Entity Definition
  const jsonLdPayload = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.coverImage,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "image": post.author.avatarUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "SponsorVault",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sponsorvault.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sponsorvault.com/blog/${post.slug}`
    }
  };

  return (
    <article className="min-h-screen bg-neutral-950 px-4 py-16 text-white sm:px-6 lg:px-8 selection:bg-purple-500/30">
      {/* Inject Structured Semantic Schema Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Navigation Breadcrumb Line */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transform transition-transform group-hover:-translate-x-1" />
          Back to Strategy Blog
        </Link>

        {/* Header Metadata Block */}
        <header className="space-y-4">
          <span className="inline-flex rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
            {post.category}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed font-normal">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 border-y border-white/5 py-4 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-neutral-900">
                <Image src={post.author.avatarUrl} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-[10px] text-neutral-500">{post.author.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-neutral-500" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-neutral-500" />
              {post.readingTimeMinutes} min read
            </div>
          </div>
        </header>

        {/* Hero Cover Canvas Segment */}
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          <Image src={post.coverImage} alt="Post cover graphics illustration" fill className="object-cover" priority />
        </div>

        {/* Core Rich Text Content Body */}
        <div className="mt-12 text-neutral-300 leading-8 text-base font-normal space-y-6 max-w-none">
          {/* A lightweight structural layout handler mapping raw string breaks safely for runtime parsing */}
          {post.content.trim().split("\n\n").map((block, index) => {
            if (block.startsWith("## ")) {
              return <h2 key={index} className="text-2xl font-bold text-white tracking-tight mt-8 mb-4">{block.replace("## ", "")}</h2>;
            }
            if (block.startsWith("### ")) {
              return <h3 key={index} className="text-xl font-semibold text-white tracking-tight mt-6 mb-3">{block.replace("### ", "")}</h3>;
            }
            if (block.startsWith("* ")) {
              return (
                <ul key={index} className="list-disc list-inside space-y-2 pl-4 text-neutral-300">
                  {block.split("\n").map((li, liIdx) => (
                    <li key={liIdx}>{li.replace("* ", "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index} className="leading-relaxed text-neutral-300">{block}</p>;
          })}
        </div>

        {/* Tags Block Area */}
        <div className="mt-12 flex flex-wrap gap-2 border-t border-white/5 pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-white/5 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-400">
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
