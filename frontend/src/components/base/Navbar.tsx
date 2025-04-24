"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "../common/UserAvatar";
import LogoutModal from "../auth/LogoutModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <LogoutModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <nav className="flex justify-between items-center h-14 p-4 w-full">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Versus
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserAvatar name="Lakshay" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
};

export default Navbar;
