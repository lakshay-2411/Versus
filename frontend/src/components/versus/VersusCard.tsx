"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import VersusCardMenu from "./VersusCardMenu";
import Link from "next/link";

const VersusCard = ({
  versus,
  token,
}: {
  versus: VersusType;
  token: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle>{versus.title}</CardTitle>
        <VersusCardMenu versus={versus} token={token} />
      </CardHeader>
      <CardContent className="h-[300px]">
        {versus?.image && (
          <Image
            className="rounded-md w-full h-[220px] object-contain"
            width={500}
            height={500}
            src={getImageUrl(versus.image)}
            alt={versus.title}
          />
        )}
        <p>{versus.description}</p>
        <p>
          <strong>Expire At:</strong>
          {new Date(versus.expire_at).toDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/versus/items/${versus.id}`}>
          <Button>Items</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VersusCard;
