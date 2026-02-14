import { useCurrentUser } from "@/hooks/auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  // checking if user is logged in or not
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  // if user is logged in redirect to home page
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Outlet />;
};

export default AuthLayout;
