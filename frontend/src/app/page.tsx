import HeroSection from "@/components/base/HeroSection";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function App() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <HeroSection />
    </div>
  );
}
