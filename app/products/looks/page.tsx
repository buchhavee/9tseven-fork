import { redirect } from "next/navigation";
import { getUGCLookSlugs } from "@/app/lib/ugcLooks";

export default function ShopTheLookIndex() {
  const [first] = getUGCLookSlugs();
  redirect(first ? `/products/looks/${first}` : "/products");
}
