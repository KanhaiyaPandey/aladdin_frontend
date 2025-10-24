import { getCategories } from "../../../lib/loaders";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find((cat) => cat.slug === slug);

    if (!category) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">Category not found.</p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center justify-center font-body">
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">{category.title}</h1>
          <p className="text-gray-600 mb-8">{category.description}</p>

          {category.banner && (
            <div className="mb-8">
              <img
                src={category.banner}
                alt={category.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-500">
              Products for this category will be displayed here.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Error loading category.</p>
      </div>
    );
  }
}
