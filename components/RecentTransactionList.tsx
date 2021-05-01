import React, { useEffect } from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
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
            <IconButton
                aria-label="Fetch transactions"
                onClick={handleLoadClick}
                icon={<RepeatIcon />}
            />
            <Box>
                <Text>Most recent transactions:</Text>
                {recentTransactions.map((transaction) => (
                    <Box borderRadius="md" bg="teal" color="white" mt="5" p="3">
                        <Text>Item bought: {transaction.pictureAsset.inventory.name}</Text>
                        <Text>Date of transaction: {convertDate(transaction.date)}</Text>
                        <Text>Transaction revenue: ${transaction.revenue}</Text>
                        <Text>Quantity bought: {transaction.quantity}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};

export default RecentTransactionList;