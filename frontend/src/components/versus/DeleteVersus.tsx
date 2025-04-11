"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import { VERSUS_URL } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/commonActions";

const DeleteVersus = ({
  isOpen,
  setIsOpen,
  id,
  token,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  token: string;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteVersus = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${VERSUS_URL}/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (data?.message) {
        setLoading(false);
        clearCache("dashboard");
        toast.success(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong, please try again later");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete your versus permanently. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteVersus} disabled={loading}>
            {loading ? "Deleting..." : "Yes continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVersus;
