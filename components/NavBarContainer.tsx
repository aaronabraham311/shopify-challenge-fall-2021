import React from "react";
import { Flex, Link, Text, Spacer } from "@chakra-ui/react"

const NavBarContainer: React.FC = ({ handleLogin, admin, handleLogout }) => {
  return (
    <Flex
      as="nav"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg="transparent"
      color="primary.700"
    >
      <Text fontSize="4xl">Amethyst: A Shopify Dev Challenge</Text>
      <Spacer />
      <Link 
        display="block" 
        alignContent="right" 
        onClick={admin ? handleLogout : handleLogin}
      >
        <Text>{admin ? "Log out" : "Log in"}</Text>
      </Link>
    </Flex>
  );
};

export default NavBarContainer;
