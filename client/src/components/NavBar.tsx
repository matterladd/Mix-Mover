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

export default function NavBar() {

return (
  <>
    <NavigationMenu className={"hidden sm:flex"}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink 
            render={<Link to="/"></Link>}
            className={navigationMenuTriggerStyle()}                
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            render={<Link to="/login"></Link>}      
            className={navigationMenuTriggerStyle()}
          >
            Login
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            render={<Link to="/signup"></Link>}
            className={navigationMenuTriggerStyle()}
          >
            Sign up
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            render={<Link to="/account"></Link>}
            className={navigationMenuTriggerStyle()}
          >
            Account
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* // TODO whole surface of button not clickable */}
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <ThemeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
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