import Navbar from "@/components/base/Navbar";
import AddVersus from "@/components/versus/AddVersus";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const dashboard = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);
  return (
    <div className="container">
      <Navbar />
      <div className="text-end mt-10">
        <AddVersus user={session?.user!} />
      </div>
    </div>
  );
};

export default dashboard;
