import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  // checking current user logged in or not
  const { data: user, isLoading, isError } = useCurrentUser();
  const navigate = useNavigate();

  //if not login or  somehow its return null its redirect to login page
  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      navigate("/login");
    }
  }, [user, navigate, isError, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 min-h-screen flex flex-col">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-2">
            <SidebarTrigger />
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Layout;
