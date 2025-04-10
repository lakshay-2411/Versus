"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserAvatar = ({ name }: { name: String }) => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
      <AvatarFallback>{name[1]}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
