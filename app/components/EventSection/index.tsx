import { getEvents } from "@/app/lib/eventPosts";
import EventGallery from "./EventGallery";

interface EventSectionProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export default async function EventSection({
  title = "Events",
  subtitle = "Group runs, gatherings, and moments from the 9TSEVEN community.",
  tagline = "( EVENTS )",
}: EventSectionProps = {}) {
  const events = await getEvents();
  if (events.length === 0) return null;

  return <EventGallery events={events} title={title} subtitle={subtitle} tagline={tagline} />;
}
