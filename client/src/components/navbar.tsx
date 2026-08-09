import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import ThemeToggle from "@/components/theme-toggle";
import { useAuthContext } from "@/context/auth";

const allNavLinks: {
  onlyGuest: boolean;
  onlyAuthenticated: boolean;
  label: string;
  to: string;
}[] = [
  { onlyGuest: false, onlyAuthenticated: false, label: "Home", to: "/" },
  { onlyGuest: true, onlyAuthenticated: false, label: "Login", to: "/login" },
  {
    onlyGuest: true,
    onlyAuthenticated: false,
    label: "Sign up",
    to: "/signup",
  },
  {
    onlyGuest: false,
    onlyAuthenticated: true,
    label: "Account",
    to: "/account",
  },
];

function ListItem({
  title,
  children,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        closeOnClick={true}
        render={
          <Link to={to}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  );
}

export default function NavBar() {
  const { user } = useAuthContext();
  let navLinks: { label: string; to: string }[];
  if (!user) {
    navLinks = allNavLinks.filter((link) => link.onlyAuthenticated !== true);
  } else {
    navLinks = allNavLinks.filter((link) => link.onlyGuest !== true);
  }

  return (
    <>
      {/* breakpoint for desktop resolutions */}
      <div className="hidden sm:flex items-center justify-between">
        <NavigationMenu>
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
            <NavigationMenuItem
              className={navigationMenuTriggerStyle()}
            ></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ThemeToggle className="p-4" />
      </div>

      {/* breakpoint for mobile resolutions */}
      <div className="sm:hidden flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul>
                  {navLinks.map((link) => (
                    <ListItem to={link.to} title={link.label}></ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ThemeToggle className="p-4" />
      </div>
    </>
  );
}
