"use client";
import React, { Suspense, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import dynamic from "next/dynamic";
import Env from "@/lib/env";
import { toast } from "sonner";
const EditVersus = dynamic(() => import("./EditVersus"));
const DeleteVersus = dynamic(() => import("./DeleteVersus"));

const VersusCardMenu = ({
  versus,
  token,
}: {
  versus: VersusType;
  token: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${Env.APP_URL}/versus/${versus.id}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      {isOpen && (
        <Suspense fallback={<p>Loading...</p>}>
          <EditVersus
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            versus={versus}
            token={token}
          />
        </Suspense>
      )}
      {deleteOpen && (
        <Suspense fallback={<p>Loading...</p>}>
          <DeleteVersus
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            id={versus.id}
            token={token}
          />
        </Suspense>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>Copy Link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default VersusCardMenu;
