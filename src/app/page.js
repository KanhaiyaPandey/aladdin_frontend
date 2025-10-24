import { getHomepageData } from "../lib/loaders";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  // Server-side data fetching
  const { categories, products } = await getHomepageData();

  return <HomePageClient categories={categories} products={products} />;
}
