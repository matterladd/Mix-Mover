import { Link } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { 
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';


export default function NavBar() {
    const { user } = useAuthContext();

    return (
        <>
            <NavigationMenu>
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
                            render={<Link to="/Account"></Link>}
                            className={navigationMenuTriggerStyle()}
                        >
                            Account
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}