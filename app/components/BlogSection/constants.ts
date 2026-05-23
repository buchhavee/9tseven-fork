// app/components/BlogSection/constants.ts

export type BlogPost = {
  id: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  link: { text: string; url: string } | null;
  date: string | null;
};

export type EventPost = {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  date: string | null;
  slug: string | null;
  gallery: { url: string; alt: string | null }[];
};
