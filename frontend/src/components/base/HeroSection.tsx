import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <div>
        <Image src="/versus.svg" width={450} height={450} alt="banner_image" />
      </div>
      <div className="text-center mt-4">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Versus
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-center">
          Discover the better choice, together
        </p>
        <Link href="/login">
          <Button className="mt-2">Start free</Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
