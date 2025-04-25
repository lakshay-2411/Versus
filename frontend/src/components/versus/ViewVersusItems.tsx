"use client";
import { getImageUrl } from "@/lib/utils";
import CountUp from "react-countup";
import Image from "next/image";
import React, { Fragment, useState } from "react";

const ViewVersusItems = ({ versus }: { versus: VersusType }) => {
  const [versusComments, setVersusComments] = useState(versus?.ClashComments);
  const [versusItems, setVersusItems] = useState(versus?.ClashItem);
  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {versusItems &&
          versusItems.length > 0 &&
          versusItems.map((item, index) => {
            return (
              <Fragment key={index}>
                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                  <div className="w-full flex justify-center items-center rounded-md cursor-pointer p-2 h-[300px]">
                    <Image
                      src={getImageUrl(item?.image)}
                      width={500}
                      height={500}
                      alt="preview_1"
                      className="w-full h-[300px] object-contain"
                    />
                  </div>

                  <CountUp
                    start={0}
                    end={item?.count}
                    delay={2}
                    className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                  />
                </div>

                {/* VS block */}
                {index % 2 === 0 && (
                  <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                    <h1 className="text-8xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
                      VS
                    </h1>
                  </div>
                )}
              </Fragment>
            );
          })}
      </div>

      {/* Comment section */}
      <div className="mt-4">
        {versusComments &&
          versusComments.length > 0 &&
          versusComments.map((item, index) => (
            <div
              className="w-full md:w-[600px] rounded-lg p-4 bg-muted mb-4"
              key={index}
            >
              <p className="font-bold">{item?.comment}</p>
              <p>{new Date(item?.created_at).toDateString()}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ViewVersusItems;
