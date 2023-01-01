import React, { useState } from "react";
import "./heading.css";
import { ChakraProvider, Heading } from '@chakra-ui/react'
export default function ProductTitle() {
  return (
    <>
      <ChakraProvider>
        <div className="heading">
          <Heading as="h3" size="2xl">Minecraft Modpack Manager</Heading>
        </div>
      </ChakraProvider>
    </>
  );
}
