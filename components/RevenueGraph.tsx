import React, { useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { Line } from "react-chartjs-2";
import axios from "axios";

const RevenueGraph = () => {
    const [weekData, setWeekData] = React.useState({});

    const getWeekData = async () => {
        const response = await axios.get('/api/transaction/get');
        const labels = response.data.map(items => items.date);
        const data = response.data.map(items => items.sum);
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
    };
    
    useEffect(() => {
        getWeekData();
    }, []);

    const handleLoadClick = () => {
        getWeekData();
    }

    return (
        <Box>
            <IconButton
                aria-label="Fetch data"
                onClick={handleLoadClick}
                icon={<RepeatIcon />}
            />
            <Box>
                <Line data={weekData} />
            </Box>
        </Box>
    )
};

export default RevenueGraph;