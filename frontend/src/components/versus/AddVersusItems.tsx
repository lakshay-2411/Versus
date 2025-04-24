"use client";
import { Upload } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const AddVersusItems = ({
  token,
  versusId,
}: {
  token: string;
  versusId: number;
}) => {
  return (
    <div className="mt-8 p-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {/* First block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <div className="w-full flex justify-center items-center rounded-md border-2 border-dashed p-2 h-[300px]">
            <h1 className="flex items-center space-x-2 text-sm">
              <Upload />
              <span>Upload File</span>
            </h1>
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
          <div className="w-full flex justify-center items-center rounded-md border-2 border-dashed p-2 h-[300px]">
            <h1 className="flex items-center space-x-2 text-sm">
              <Upload />
              <span>Upload File</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button className="w-52">Submit</Button>
      </div>
    </div>
  );
};

export default AddVersusItems;
