import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import signOut from "@/firebase/auth/signOut";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TMenuItems } from "@/lib/types";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const adminMenuItems: TMenuItems = [
  { id: "requests", title: "Requests", url: "/admin/requests" },
  { id: "clubs", title: "Clubs", url: "/admin/clubs" },
  { id: "groups", title: "Groups", url: "/admin/groups" },
  { id: "events", title: "Events", url: "/admin/events" },
];

const userMenuItems: TMenuItems = [
  { id: "search", title: "Search", url: "/" },
  { id: "clubs", title: "Clubs", url: "/clubs" },
  { id: "groups", title: "Groups", url: "/groups" },
  { id: "events", title: "Events", url: "/events" },
];

const Header: React.FC = () => {
  const router = useRouter();
  const { user } = useFirebaseAuth();

  const isAdmin = useMemo(() => {
    return user?.role === "admin";
  }, [user]);

  const handleSignOut = () => {
    signOut();
    if (user?.role === "admin") {
      router.push("/");
    }
  };

  return (
    <header className="p-4 flex justify-between items-center border">
      <h6 className="font-bold text-lg">Solent Social</h6>

      <NavigationMenu>
        <NavigationMenuList>
          {(isAdmin ? adminMenuItems : userMenuItems).map((i) => (
            <NavigationMenuItem key={i.id}>
              <Link href={i.url} legacyBehavior passHref>
                <NavigationMenuLink
                  className={buttonVariants({ variant: "ghost" })}
                >
                  {i.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex space-x-2">
        {user && (
          <>
            <Button>{user.email}</Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
        {!user && (
          <>
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
