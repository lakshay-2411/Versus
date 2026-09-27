import Navbar from "@/components/base/Navbar";
import VS from "@/components/versus/VS";
import { fetchSingleVersus } from "@/fetch/versusFetch";
import React from "react";

const versusItems = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;
  const versus: VersusType | null = await fetchSingleVersus(id);
  return (
    <div className="container">
      <Navbar />
      <div className="mt-3 p-4">
        <h1 className="text-2xl lg:text-4xl font-extrabold">{versus?.title}</h1>
        <p className="text-lg">{versus?.description}</p>
      </div>
      {versus && <VS versus={versus} />}
    </div>
  );
};

export default versusItems;
