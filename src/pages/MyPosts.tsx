import { InfiniteScrollTrigger } from "@/components/InfiniteScrollTrigger";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/auth";
import { usePosts } from "@/hooks/post";
import { PenSquare } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import SinglePost from "../components/SinglePost";

const MyPosts = () => {
  const { data: currentUser } = useCurrentUser();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts({
    page: 1,
  });

  const allPost = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.docs) ?? [];
  }, [data?.pages]);

  return (
    <div>
      <div className="sticky top-0 z-10 flex justify-end mb-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button asChild>
          <Link to="/create-post">
            <PenSquare size={18} />
            New Post
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allPost.length > 0 ? (
          allPost.map((post) => (
            <SinglePost
              postData={post}
              key={post.id}
              currentUserId={currentUser?.data?.id}
            />
          ))
        ) : (
          <p>No Data Found</p>
        )}

        <InfiniteScrollTrigger
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
};

export default MyPosts;
