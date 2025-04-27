"use client";
import { getImageUrl } from "@/lib/utils";
import CountUp from "react-countup";
import Image from "next/image";
import React, { Fragment, useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import socket from "@/lib/socket";
import { toast } from "sonner";

const VS = ({ versus }: { versus: VersusType }) => {
  const [versusComments, setVersusComments] = useState(versus?.ClashComments);
  const [versusItems, setVersusItems] = useState(versus?.ClashItem);
  const [comment, setComment] = useState("");
  const [hideVote, setHideVote] = useState(false);

  const handleVote = (id: number) => {
    if (versusItems && versusItems.length > 0) {
      setHideVote(true);
      updateCounter(id);
      // socket
      socket.emit(`versus-${versus?.id}`, {
        versusId: versus?.id,
        versusItemId: id,
      });
    }
  };

  const updateCounter = (id: number) => {
    const items = [...versusItems];
    const index = versusItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index].count += 1;
    }
    setVersusItems(items);
  };

  const updateComment = (payload: any) => {
    if (versusComments && versusComments.length > 0) {
      setVersusComments([payload, ...versusComments]);
    } else {
      setVersusComments([payload]);
    }
  };

  const handleComment = (event: React.FormEvent) => {
    event?.preventDefault();
    if (comment.length > 2) {
      const payload = {
        id: versus?.id,
        comment: comment,
        created_at: new Date().toDateString(),
      };
      updateComment(payload);
      socket.emit(`versus_comment-${versus?.id}`, payload);
      setComment("");
    } else {
      toast.warning("Comment should be at least 3 words long");
    }
  };

  useEffect(() => {
    socket.on(`versus-${versus?.id}`, (data) => {
      updateCounter(data?.versusItemId);
    });

    socket.on(`versus_comment-${versus?.id}`, (data) => {
      updateComment(data);
    });
  });

  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {versusItems &&
          versusItems.length > 0 &&
          versusItems.map((item, index) => {
            return (
              <Fragment key={index}>
                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col gap-2">
                  <div className="w-full flex justify-center items-center rounded-md cursor-pointer p-2 h-[300px]">
                    <Image
                      src={getImageUrl(item?.image)}
                      width={500}
                      height={500}
                      alt="preview_1"
                      className="w-full h-[300px] object-contain"
                    />
                  </div>
                  {hideVote ? (
                    <CountUp
                      start={0}
                      end={item?.count}
                      delay={0}
                      className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    />
                  ) : (
                    <Button onClick={() => handleVote(item?.id)}>
                      <span className="text-sm">Vote</span> <ThumbsUp />
                    </Button>
                  )}
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

      <form
        className="mt-4 w-full flex flex-col items-center justify-center"
        onSubmit={handleComment}
      >
        <Textarea
          placeholder="Type your suggestions ☺️"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-1/2"
        />
        <Button className="w-1/4 mt-2">Submit Comment</Button>
      </form>

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

export default VS;
