import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button';
import ThemeToggle from '@/components/theme-toggle';

const navLinks: {label: string, to:string }[] = [
  { label: "Home", to: "/" }, 
  { label: "Login", to: "/login" }, 
  { label: "Sign up", to: "/signup" }, 
  { label: "Account", to: "/account" }, 
];

export default function NavBar() {
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
      <div className='sm:hidden'>
        <Sheet>
          <SheetTrigger 
            render={<Button variant={'ghost'}>Open</Button>}
          >
          </SheetTrigger>
          <SheetContent side='left' className={'w-3/4 max-w-none sm:max-w-none min-w-0'}>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>This action cannot be undone.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}