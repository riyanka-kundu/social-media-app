import { useEffect, useRef } from "react";

type TInfiniteScrollTriggerProps = {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

export const InfiniteScrollTrigger = ({
  fetchNextPage,
  hasNextPage = true,
  isFetchingNextPage = false,
}: TInfiniteScrollTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    const current = triggerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return <div ref={triggerRef} style={{ height: 1 }} />;
};
