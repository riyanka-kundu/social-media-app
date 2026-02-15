import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDelete, useLike } from "@/hooks/post";
import { formatRelativeDate } from "@/lib/utils";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { TPost } from "../type";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type SinglePostProp = {
  postData: TPost;
  currentUserId?: string;
};
//if prop changes component will rerender, suppose i have 1k data ,i dont want rerender the
// entire 1k components when another element push to the array
// I just want to append  the new data without rerendering everything.

const SinglePost = memo(({ postData, currentUserId }: SinglePostProp) => {
  const { mutate: deletePost, isPending: isDeleting } = useDelete();
  const { mutateAsync: likePost, isPending: isLiking } = useLike();
  const navigate = useNavigate();
  const isOwner = currentUserId === postData.creator.id;
  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    navigate(`/post/${postData.id}`);
  };
  return (
    <div
      className="rounded-xl border bg-white shadow-sm transition hover:shadow-md"
      onClick={handlePostClick}
    >
      {/* Images */}
      {postData.images.length > 0 && (
        <div
          className={`grid gap-2 rounded-t-xl overflow-hidden ${
            postData.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <img
            src={postData.images[0]}
            alt="post image"
            className="h-40 w-full object-cover"
          />
          {postData.images.length > 1 && (
            <div className="relative">
              <img
                src={postData.images[1]}
                alt="post image"
                className="h-40 w-full object-cover"
              />
              {postData.images.length > 2 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold">
                  +{postData.images.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-1 text-lg font-semibold">{postData.title}</h3>

        {/* Body */}
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {postData.body}
        </p>

        {/* Tags */}
        {postData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {postData.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Creator */}
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {postData.creator.profilePicture && (
                <AvatarImage
                  src={postData.creator.profilePicture}
                  alt={postData.creator.name}
                />
              )}
              <AvatarFallback>
                {postData.creator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium">
                {postData.creator.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatRelativeDate(postData.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={isLiking}
              onClick={() => likePost(postData.id)}
              className="flex items-center gap-1"
            >
              <Heart
                className={`h-4 w-4 ${
                  postData.likeCount > 0 ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="text-xs">{postData.likeCount}</span>
            </Button>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/edit-post/${postData.id}`)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => deletePost(postData.id)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
SinglePost.displayName = "SinglePost";
export default SinglePost;
