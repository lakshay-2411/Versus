"use client";
import { Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { VERSUS_ITEMS_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";

const AddVersusItems = ({
  token,
  versusId,
}: {
  token: string;
  versusId: number;
}) => {
  const [items, setItems] = useState<Array<VersusItemForm>>([
    { image: null },
    { image: null },
  ]);

  const [urls, setUrls] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const imageRef1 = useRef<HTMLInputElement | null>(null);
  const imageRef2 = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedItems = [...items];
      updatedItems[index].image = file;
      setItems(updatedItems);
      const imageUrl = URL.createObjectURL(file);
      const updatedUrls = [...urls];
      updatedUrls[index] = imageUrl;
      setUrls(updatedUrls);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("id", versusId.toString());
      items.map((item) => {
        if (item.image) formData.append(`images[]`, item.image);
      });
      if (formData.get("images[]")) {
        setLoading(true);
        const { data } = await axios.post(VERSUS_ITEMS_URL, formData, {
          headers: {
            Authorization: token,
          },
        });
        if (data?.message) {
          toast.success(data?.message);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
        setLoading(false);
      } else {
        toast.warning("Please upload both images.");
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          if (error?.response?.data?.errors) {
            error?.response?.data?.errors?.map((err: string) =>
              toast.error(err)
            );
          }
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="mt-8 p-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {/* First block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <input
            type="file"
            className="hidden"
            ref={imageRef1}
            onChange={(event) => handleImageChange(event, 0)}
          />
          <div
            className="w-full flex justify-center items-center rounded-md border-2 cursor-pointer border-dashed p-2 h-[300px]"
            onClick={() => imageRef1?.current?.click()}
          >
            {urls.length > 0 && urls?.[0] !== "" ? (
              <Image
                src={urls?.[0]}
                width={500}
                height={500}
                alt="preview_1"
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <h1 className="flex items-center space-x-2 text-sm">
                <Upload />
                <span>Upload File</span>
              </h1>
            )}
          </div>
        </div>

        {/* VS block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <h1 className="text-8xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            VS
          </h1>
        </div>

        {/* Second block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <input
            type="file"
            className="hidden"
            ref={imageRef2}
            onChange={(event) => handleImageChange(event, 1)}
          />
          <div
            className="w-full flex justify-center items-center rounded-md border-2 cursor-pointer border-dashed p-2 h-[300px]"
            onClick={() => imageRef2?.current?.click()}
          >
            {urls.length > 0 && urls?.[1] !== "" ? (
              <Image
                src={urls?.[1]}
                width={500}
                height={500}
                alt="preview_2"
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <h1 className="flex items-center space-x-2 text-sm">
                <Upload />
                <span>Upload File</span>
              </h1>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button className="w-52" onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddVersusItems;
