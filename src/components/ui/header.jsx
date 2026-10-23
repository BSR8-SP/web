import * as React from "react"
// import { NavLink } from "react-router";
import { cn } from "cn"
import LogoMark from '../../assets/logo_mark.png'
import LogoText1 from '../../assets/logo_text_1.png'
import { Button } from './button'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from './navigation-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu'

function Header({
    className,
    size = "default",
    ...props
}) {
    return (
        <header className="dark relative z-50 bg-[rgb(0,0,0)] text-[rgb(255,255,255)] h-[72px] px-4 flex items-center justify-between">

            <div className="flex flex-row items-center gap-5 mr-10">
                <img src={LogoMark} alt="Logo mark" className="h-[64px] w-auto transition-transform duration-700 ease-out hover:rotate-[360deg] hover:ease-in-out"/>
                <div className="bg-[rgb(32,32,32)] shrink-0 min-w-max">
                    <img src={LogoText1} alt="Logo text" className="h-[48px] w-auto object-contain" />
                </div>
            </div>

            <div>

            {/* Navigation bar shown on desktop (i.e. large screens) */}
            <div className="hidden lg:block">
                <NavigationMenu>
                    <NavigationMenuList>

                        <NavigationMenuItem>
                            <NavigationMenuLink>Placeholder Link 1</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink>Placeholder Link 2</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink>Placeholder Link 3</NavigationMenuLink>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        

            {/* Navigation bar shown on mobile (i.e. smaller screens) */}
            <div className="lg:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" />}>
                        ☰
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[200px]">

                        <DropdownMenuGroup>
                            <DropdownMenuItem>Placeholder Link 1</DropdownMenuItem>
                            <DropdownMenuItem>Placeholder Link 2</DropdownMenuItem>
                            <DropdownMenuItem>Placeholder Link 3</DropdownMenuItem>
                        </DropdownMenuGroup>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>
        </header>    
    )
}

export { Header }