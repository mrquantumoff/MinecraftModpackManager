import React, { useState } from "react";
import "./heading.css";
import { useTranslation } from "react-i18next";
import { ChakraProvider, Heading } from '@chakra-ui/react'
export default function ProductTitle() {
  const { t } = useTranslation();
  return (
    <>
      <ChakraProvider>
        <div className="heading">
          <Heading as="h3" size="2xl">{t("heading")}</Heading>
        </div>
      </ChakraProvider>
    </>
  );
}
