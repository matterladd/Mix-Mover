import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { Hamburger } from "@hugeicons/core-free-icons";
import { useAuthContext } from "@/context/auth";

const allNavLinks: { onlyGuest: boolean, onlyAuthenticated: boolean, label: string; to: string }[] = [
  { onlyGuest: false, onlyAuthenticated: false, label: "Home", to: "/" },
  { onlyGuest: true, onlyAuthenticated: false, label: "Login", to: "/login" },
  { onlyGuest: true, onlyAuthenticated: false, label: "Sign up", to: "/signup" },
  { onlyGuest: false, onlyAuthenticated: true, label: "Account", to: "/account" },
];

export default function NavBar() {
  const { user } = useAuthContext();
  let navLinks: { label: string; to: string }[];
  if (!user) {
    navLinks = allNavLinks.filter(link => link.onlyAuthenticated !== true);
  } else {
    navLinks = allNavLinks.filter(link => link.onlyGuest !== true);
  }

  return (
    <>
      {/* breakpoint for desktop resolutions */}
      <NavigationMenu className={"hidden sm:flex"}>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to={link.to}></Link>}
                className={navigationMenuTriggerStyle()}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          {/* // TODO whole surface of button not clickable */}
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <ThemeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* breakpoint for mobile resolutions */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant={"ghost"}>
                <HugeiconsIcon icon={Hamburger}></HugeiconsIcon>
              </Button>
            }
          ></SheetTrigger>
          <SheetContent
            side="left"
            className={"w-3/4 max-w-none sm:max-w-none min-w-0"}
          >
            <SheetHeader>
              <SheetTitle>MixMover</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            {navLinks.map((link) => (
              <div className="p-4">
                <Link to={link.to}>{link.label}</Link>
              </div>
            ))}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
