import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/auth";
import { useDelete, useLike, useSinglePost } from "@/hooks/post";
import { formatRelativeDate } from "@/lib/utils";
import { ArrowLeft, Heart, Loader2, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Post = () => {
  const params = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const { data: postData, isLoading, error } = useSinglePost(id);
  const { mutateAsync: likePost, isPending: isLiking } = useLike();
  const { mutate: deletePost, isPending: isDeleting } = useDelete();

  const post = postData?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Post not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const isOwner = currentUser?.data?.id === post.creator.id;

  const handleDelete = () => {
    deletePost(post.id, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>
      </Button>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {/* Images */}
        {post.images.length > 0 && (
          <div className="w-full bg-muted/30">
            {post.images.length === 1 ? (
              <img
                src={post.images[0]}
                alt="Post content"
                className="max-h-[500px] w-full object-contain"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="h-64 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Header: Author & Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                {post.creator.profilePicture && (
                  <AvatarImage
                    src={post.creator.profilePicture}
                    alt={post.creator.name}
                  />
                )}
                <AvatarFallback>
                  {post.creator.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold leading-none">
                  {post.creator.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatRelativeDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
              {post.body}
            </p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer: Likes & Interactions */}
          <div className="border-t pt-4 mt-6">
            <Button
              variant="ghost"
              disabled={isLiking}
              onClick={() => likePost(post.id)}
              className="gap-2"
            >
              <Heart
                className={`h-5 w-5 ${
                  post.likeCount > 0 ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="font-medium">
                {post.likeCount} {post.likeCount === 1 ? "Like" : "Likes"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
