import React, { useState, useMemo } from "react";
import MainLayout from "../components/Layout/MainLayout";
import CategoryCard from "../components/Categories/CategoryCard";
import { CategoryCardSkeleton } from "../components/UI/Skeleton";
import { useCategories } from "../hooks/useCategories";

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
      <div className="min-h-screen bg-[#FEFAF6] pt-28 pb-20">
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
              <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-[#EADBC8]/40">
                <div className="w-24 h-24 bg-[#FEFAF6] rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg
                    className="w-12 h-12 text-[#102C57]/20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#102C57] uppercase tracking-widest mb-4">
                  No categories matched
                </h3>
                <p className="text-[#102C57]/40 text-sm max-w-sm mx-auto font-medium">
                  We couldn't find any categories matching your search. Try
                  adjusting your keywords.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-10 text-[#102C57] font-black uppercase text-xs tracking-widest border-b-2 border-[#DAC0A3] pb-1 hover:text-[#DAC0A3] transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Categories;
