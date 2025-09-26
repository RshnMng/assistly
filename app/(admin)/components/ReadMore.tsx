"use client";
import { useState } from "react";

type ReadMoreProps = {
  text: string;
  chunkSize?: number;
};

export function ReadMore({ text, chunkSize = 200 }: ReadMoreProps) {
  const [visibleCount, setVisibleCount] = useState(chunkSize);

  const isFullyVisible = visibleCount >= text.length;
  const isAtMinimum = visibleCount <= chunkSize;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + chunkSize, text.length));
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(prev - chunkSize, chunkSize));
  };

  const handleReset = () => {
    setVisibleCount(chunkSize);
  };

  const visibleText = text.slice(0, visibleCount);

  return (
    <div className=" whitespace-pre-wrap break-words w-full pt-5 md:p-0">
      {isFullyVisible ? visibleText : visibleText + `...`}

      <div
        className={
          !isAtMinimum
            ? "mt-1 space-x-2  justify-between flex "
            : "mt-1 space-x-2  justify-end flex "
        }
      >
        {!isAtMinimum && (
          <button
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={handleShowLess}
          >
            Show less
          </button>
        )}
        {!isFullyVisible && (
          <button
            className="text-blue-600 cursor-pointer hover:underline "
            onClick={handleShowMore}
          >
            Read more
          </button>
        )}

        {visibleCount > chunkSize && (
          <button
            className="text-red-600 cursor-pointer hover:underline"
            onClick={handleReset}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
