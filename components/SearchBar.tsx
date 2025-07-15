"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <form
      className="flex justify-center items-center gap-3 mb-8"
      onSubmit={handleSearch}
    >
      <input
        className="bg-white dark:bg-transparent rounded-md w-full h-10 foucus:outline-none ring-2 focus:ring-4 transition ring-gray-200 dark:ring-neutral-600 focus:ring-orange-500 border border-gray-300 dark:border-none text-black dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 px-4"
        placeholder="검색어를 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="primary-btn h-10 w-12 disabled:bg-gray-300 dark:disabled:bg-neutral-400 disabled:text-gray-500 dark:disabled:text-neutral-300 disabled:cursor-not-allowed"
      >
        검색
      </button>
    </form>
  );
}
