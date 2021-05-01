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

    return (
        <Box>
            <IconButton
                aria-label="Fetch transactions"
                onClick={handleLoadClick}
                icon={<RepeatIcon />}
            />
            <Box>
                <Text>Most recent transactions</Text>
                {recentTransactions.map((transaction) => (
                    <Box>
                        <Text>{transaction.date}</Text>
                        <Text>{transaction.revenue}</Text>
                        <Text>{transaction.quantity}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};

export default RecentTransactionList;