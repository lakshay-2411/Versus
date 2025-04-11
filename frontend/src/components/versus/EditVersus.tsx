"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import axios, { AxiosError } from "axios";
import { VERSUS_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import { clearCache } from "@/actions/commonActions";

const EditVersus = ({
  token,
  versus,
  isOpen,
  setIsOpen,
}: {
  token: string;
  versus: VersusType;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [versusData, setVersusData] = useState<VersusFormType>({
    title: versus?.title,
    description: versus?.description,
  });
  const [date, setDate] = React.useState<Date | null>(
    new Date(versus?.expire_at)
  );
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<VersusFormTypeError>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", versusData?.title ?? "");
      formData.append("description", versusData?.description ?? "");
      formData.append("expire_at", date?.toISOString() ?? "");
      if (image) formData.append("image", image);
      const { data } = await axios.put(`${VERSUS_URL}/${versus.id}`, formData, {
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      if (data?.message) {
        clearCache("dashboard");
        setVersusData({});
        setDate(null);
        setImage(null);
        setErrors({});
        toast.success(data?.message);
        setIsOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErrors(error.response?.data?.errors);
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Versus</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Versus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={versusData?.title ?? ""}
              onChange={(e) =>
                setVersusData({ ...versusData, title: e.target.value })
              }
            />
            <span className="text-red-500">{errors?.title}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={versusData?.description ?? ""}
              onChange={(e) =>
                setVersusData({ ...versusData, description: e.target.value })
              }
            />
            <span className="text-red-500">{errors?.description}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              placeholder=""
              onChange={handleImageChange}
            />
            <span className="text-red-500">{errors?.image}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="expire_at">Expire At</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full mt-2 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date ?? new Date()}
                  onSelect={(date) => setDate(date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-red-500">{errors?.expire_at}</span>
          </div>
          <div className="mt-4">
            <Button disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVersus;
