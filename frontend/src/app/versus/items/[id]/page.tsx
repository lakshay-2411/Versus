import {
  authOptions,
  CustomSession,
} from "@/app/api/auth/[...nextauth]/options";
import Navbar from "@/components/base/Navbar";
import AddVersusItems from "@/components/versus/AddVersusItems";
import { fetchSingleVersus } from "@/fetch/versusFetch";
import { getServerSession } from "next-auth";
import React from "react";

const versusItems = async ({ params }: { params: { id: number } }) => {
  const versus: VersusType | null = await fetchSingleVersus(params.id);
  const session: CustomSession | null = await getServerSession(authOptions);
  return (
    <div className="container">
      <Navbar />
      <div className="mt-3 p-4">
        <h1 className="text-2xl lg:text-4xl font-extrabold">{versus?.title}</h1>
        <p className="text-lg">{versus?.description}</p>
      </div>
      <AddVersusItems token={session?.user?.token!} versusId={params?.id} />
    </div>
  );
};

export default versusItems;
