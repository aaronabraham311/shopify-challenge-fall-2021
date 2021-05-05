import React, { useEffect } from "react";
import { Box, Text, IconButton, Flex, Spacer } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { Line } from "react-chartjs-2";
import axios from "axios";

const RevenueGraph = () => {
    const [weekData, setWeekData] = React.useState({});
    const [totalRevenue, setTotalRevenue] = React.useState(0);

    const getWeekData = async () => {
        const response = await axios.get('/api/transactions?recentThree=false&graphData=true');
        const { weekRevenue, totalRevenue} = response.data;
        const labels = weekRevenue.map(items => items.date);
        const data = weekRevenue.map(items => items.sum);
        const lineObj = {
            labels,
            datasets: [{
                label: "7 day graph of revenue",
                data,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }]
        }
        setWeekData(lineObj);
        setTotalRevenue(totalRevenue.sum.revenue);
    };
    
    useEffect(() => {
        getWeekData();
    }, []);

    const handleLoadClick = () => {
        getWeekData();
    }

    return (
        <Box>
            <Flex>
                <Text fontSize="lg" as="b">Total revenue: ${totalRevenue.toFixed(2)}</Text>
                <Spacer />
                <IconButton
                    aria-label="Fetch data"
                    onClick={handleLoadClick}
                    icon={<RepeatIcon />}
                />
            </Flex>
            <Box>
                <Line type='line' data={weekData} />
            </Box>
        </Box>
    )
};

export default RevenueGraph;