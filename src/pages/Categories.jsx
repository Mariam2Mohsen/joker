import React, { useState, useMemo } from "react";
import MainLayout from "../components/Layout/MainLayout";
import CategoryCard from "../components/Categories/CategoryCard";
import { CategoryCardSkeleton } from "../components/UI/Skeleton";
import { useCategories } from "../hooks/useCategories";
import ZeroState from "../components/UI/ZeroState";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { categories, isLoading } = useCategories();

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEFAF6] pt-16 md:pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-[#DAC0A3]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DAC0A3]">
                  Category Explorer
                </span>
              </div>
              <h1 className="text-6xl font-black text-[#102C57] uppercase tracking-tighter mb-6 leading-none">
                Browse All <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102C57] to-[#DAC0A3]">
                  Service Categories
                </span>
              </h1>
              <p className="text-[#102C57]/50 text-lg font-medium leading-relaxed max-w-xl">
                Find exactly what you need from our curated list of professional
                services, from home maintenance to personal care.
              </p>
            </div>


          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CategoryCardSkeleton key={i} />)
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <ZeroState 
                  title="No Categories Found" 
                  message={searchQuery ? `We couldn't find any categories matching "${searchQuery}". Please try a different search term.` : "There are currently no active service categories. Please check back later."}
                  actionLabel={searchQuery ? "Clear Search" : "Refresh Page"}
                  onAction={searchQuery ? () => setSearchQuery("") : () => window.location.reload()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Categories;
