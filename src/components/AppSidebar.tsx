import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUser, useLogout } from "@/hooks/auth";
import { Home, LogOut, MessageCircle, PenSquare, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function getInitials(name: string) {
  return name?.charAt(0).toUpperCase();
}

const navItems = [
  { title: "Feed", url: "/", icon: Home },
  { title: "Create Post", url: "/create-post", icon: PenSquare },
  { title: "My Posts", url: "/my-posts", icon: User },
  { title: "Chat", url: "/chat", icon: MessageCircle },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const user = data?.data?.user;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 text-lg font-semibold">Social</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-primary/80! text-primary-foreground! font-semibold! hover:bg-primary/90! hover:text-primary-foreground! transition-all duration-200 ease-in-out"
                          : ""
                      }
                    >
                      <Link to={item.url}>
                        <item.icon size={20} strokeWidth={2} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <Avatar size="sm">
                    {user.profilePicture && (
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                    )}
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton>
                  <LogOut size={20} strokeWidth={2} />
                  <span>Logout</span>
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will log you out of your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
