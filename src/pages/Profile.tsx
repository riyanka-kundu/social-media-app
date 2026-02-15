import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/auth";
import { formatRelativeDate } from "@/lib/utils";
import {
  Calendar,
  Loader2,
  Mail,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";

const Profile = () => {
  const { data, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile.</p>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl border bg-white shadow-sm">
        {/* Cover / Header */}
        <div className="relative h-32 rounded-t-xl bg-gradient-to-r from-primary/80 to-primary/40">
          <div className="absolute -bottom-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              {user.profilePicture && (
                <AvatarImage src={user.profilePicture} alt={user?.name} />
              )}
              <AvatarFallback className="text-2xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name and Edit */}
        <div className="px-6 pt-16 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/edit-profile">
                <Pencil className="h-4 w-4 mr-1" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-xl border bg-white shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold">Details</h2>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium capitalize">
                {user.gender || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium">
                {user.dateOfBirth
                  ? moment(user.dateOfBirth).format("D MMM YYYY")
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium">
                {formatRelativeDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
