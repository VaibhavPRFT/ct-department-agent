import PageHero from "@/components/PageHero";
import QuarterlyPlanView from "@/components/QuarterlyPlanView";
import data from "@/data/quarterly-plan.json";

export const metadata = {
  title: "commercetools Quarterly Plan — Royal Cyber",
};

export default function QuarterlyPlanPage() {
  return (
    <>
      <PageHero
        eyebrow="Royal Cyber · Quarterly Plan Agent"
        title={data.meta.title}
        description={`${data.meta.generated} · ${data.meta.quartersLabel}`}
      />
      <QuarterlyPlanView data={data} />
    </>
  );
}
