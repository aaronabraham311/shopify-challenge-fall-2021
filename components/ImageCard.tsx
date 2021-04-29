import React from "react";
import { Box, Image, Badge } from "@chakra-ui/react"

const ImageCard: React.FC = ({
    imageFilename,
    imageTag,
    itemTitle,
}) => {
    return (
        <Box>
            <Box height="250px">
                <Image src={imageFilename}/>
            </Box>
            <Box pl="6" pt="6" alignItems="baseline">
                <Badge borderRadius="full" px="2" colorScheme="teal">
                    {imageTag}
                </Badge>
            </Box>
            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" pl="6" pt="6">
                {itemTitle}
            </Box>
        </Box>
    );
};

export default ImageCard;
