import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/work/CaseStudy";
import { getProject, getCaseStudyProjects } from "@/data/projects.full";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudyProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  const url = `/projects/${project.slug}`;
  const image = project.cover ?? "/og-image.webp";
  // Own openGraph block: otherwise the layout's og:url (the homepage) is
  // inherited and link previews such as LinkedIn resolve to the homepage.
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.name,
      title: `${project.name} · ${SITE.name}`,
      description: project.tagline,
      images: [{ url: image, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} · ${SITE.name}`,
      description: project.tagline,
      images: [image],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || !project.caseStudy) {
    notFound();
  }

  return <CaseStudy project={project} />;
}
