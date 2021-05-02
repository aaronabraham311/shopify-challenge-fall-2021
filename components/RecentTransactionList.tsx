import React, { useEffect } from "react";
import { Box, IconButton, Text, Flex, Spacer } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";

const RecentTransactionList = () => {
    const [recentTransactions, setRecentTransactions] = React.useState([]);

    const getRecentTransactions = async () => {
        const response = await axios.get('/api/transaction/recentThree');
        setRecentTransactions(response.data);
    };
    
    useEffect(() => {
        getRecentTransactions();
    }, []);

    const handleLoadClick = () => {
        getRecentTransactions();
    }

    const convertDate = (date) => {
        const dateConverted = new Date(date);
        let month = '' + (dateConverted.getMonth() + 1);
        let day = '' + (dateConverted.getDate());
        const year = dateConverted.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }

    return (
        <Box>
            <Flex>
                <Text fontSize="lg" as="b">Most recent transactions</Text>
                <Spacer />
                <IconButton
                    aria-label="Fetch transactions"
                    onClick={handleLoadClick}
                    icon={<RepeatIcon />}
                />
            </Flex>
            <Box>
                {recentTransactions.map((transaction) => (
                    <Box borderRadius="md" bg="teal" color="white" mt="5" p="3">
                        <Text><b>Date of transaction:</b> {convertDate(transaction.date)}</Text>
                        <Text><b>Transaction revenue:</b> ${transaction.revenue}</Text>
                        <Text><b>Quantity bought:</b> {transaction.quantity}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};

export default RecentTransactionList;