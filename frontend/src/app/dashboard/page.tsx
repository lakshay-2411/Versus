import Navbar from "@/components/base/Navbar";
import AddVersus from "@/components/versus/AddVersus";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchVersus } from "../fetch/versusFetch";
import VersusCard from "@/components/versus/VersusCard";

const dashboard = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);
  const versus: Array<VersusType> | [] = await fetchVersus(
    session?.user?.token!
  );
  // console.log("versus", versus);

  return (
    <div className="container">
      <Navbar />
      <div className="text-end mt-10">
        <AddVersus user={session?.user!} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mt-6">
        {versus.length > 0 &&
          versus.map((item, index) => (
            <VersusCard
              versus={item}
              key={index}
              token={session?.user?.token!}
            />
          ))}
      </div>
    </div>
  );
};

export default dashboard;
