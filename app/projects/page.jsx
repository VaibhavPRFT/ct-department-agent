import PageHero from "@/components/PageHero";
import ProjectsView from "@/components/ProjectsView";
import data from "@/data/projects.json";

export const metadata = {
  title: "Project Teams — Royal Cyber commercetools",
};

export default function ProjectsPage() {
  const { meta } = data;
  return (
    <>
      <PageHero
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={`${meta.intro} ${meta.status} · ${meta.updated}`}
        meta={meta.stats.map((s) => `${s.value} ${s.label}`)}
      />
      <ProjectsView data={data} />
    </>
  );
}
