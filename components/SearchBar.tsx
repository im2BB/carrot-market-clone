"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [search, setSearch] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <form className="flex justify-center items-center gap-3 mb-8" onSubmit={handleSearch}>
      <input
        className="bg-transparent rounded-md w-full h-10 foucus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none"
        placeholder="검색어를 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="primary-btn h-10 w-12 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      >
        검색
      </button>
    </form>
  );
} 