import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const StatsScreen = () => {
    const [flightData, setFlightData] = useState<{ airport_name: string; country: string; flight_count: number }[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/stats/flight-counts")
            .then((response) => response.json())
            .then((data) => setFlightData(data))
            .catch((error) => console.error("Error fetching flight data:", error));
    }, []);

    const labels = flightData.map((item) => `${item.airport_name}\n(${item.country})`);
    const values = flightData.map((item) => item.flight_count);

    return (
        <ScrollView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                Estadísticas de Vuelos ✈️
            </Text>
            <BarChart
                data={{
                    labels: labels,
                    datasets: [{ data: values }],
                }}
                width={Dimensions.get("window").width - 20}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    backgroundGradientFrom: "#f7f7f7",
                    backgroundGradientTo: "#e3e3e3",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                verticalLabelRotation={0}
                fromZero
            />
        </ScrollView>
    );
};

export default StatsScreen;
