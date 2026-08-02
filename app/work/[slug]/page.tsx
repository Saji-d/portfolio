import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/work/CaseStudy";
import { getProject, getFeaturedProjects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return getFeaturedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || !project.featured) {
    notFound();
  }

  return <CaseStudy project={project} />;
}
