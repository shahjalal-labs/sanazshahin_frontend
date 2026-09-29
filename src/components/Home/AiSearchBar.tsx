"use client";

import React from "react";
import { Sparkles, X, Loader2, CornerDownLeft, Undo2, Check } from "lucide-react";

interface AiSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  isAiLoading: boolean;
  isCorrected: boolean;
  correctedQuery: string;
  useOriginal: boolean;
  onUseOriginal: () => void;
  onUseCorrected: () => void;
  onApplyCorrection: () => void;
  onSubmit: () => void;
  resultCount?: number;
}

export default function AiSearchBar({
  searchTerm,
  onSearchChange,
  onClear,
  isAiLoading,
  isCorrected,
  correctedQuery,
  useOriginal,
  onUseOriginal,
  onUseCorrected,
  onApplyCorrection,
  onSubmit,
  resultCount,
}: AiSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col items-end w-full sm:w-96">
      {/* Search Input Box */}
      <div className="relative w-full">
        {/* Left AI / Search Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none text-primary">
          {isAiLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes (AI typo-tolerant)..."
          className="w-full border border-primary/80 focus:border-primary focus:ring-2 focus:ring-primary/20 py-2.5 pl-10 pr-20 rounded-full text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm bg-white"
        />

        {/* Right Action Buttons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {searchTerm && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* AI Badge */}
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 select-none">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        </div>
      </div>

      {/* AI Typo-Correction Notice */}
      {isCorrected && searchTerm.trim() && (
        <div className="mt-2 text-xs text-gray-700 bg-blue-50/90 border border-blue-200/80 rounded-xl px-3 py-2 flex flex-col gap-1 w-full animate-fade-in shadow-xs">
          {!useOriginal ? (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>
                  Fixed typo: Showing results for{" "}
                  <strong className="text-primary font-bold">"{correctedQuery}"</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onApplyCorrection}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  title="Replace typo with corrected word in the search box"
                >
                  <Check className="w-3 h-3" />
                  Auto-fix input
                </button>
                <button
                  type="button"
                  onClick={onUseOriginal}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  <Undo2 className="w-3 h-3" />
                  Exact "{searchTerm}"
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-gray-600">
                Searching exact text <strong className="text-gray-900">"{searchTerm}"</strong>
              </span>
              <button
                type="button"
                onClick={onUseCorrected}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
              >
                <CornerDownLeft className="w-3 h-3" />
                Use AI fix "{correctedQuery}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result count badge if active */}
      {searchTerm.trim() && typeof resultCount === "number" && (
        <div className="text-[11px] text-gray-400 mt-1 pr-2">
          {resultCount === 1 ? "1 recipe found" : `${resultCount} recipes found`}
        </div>
      )}
    </div>
  );
}
