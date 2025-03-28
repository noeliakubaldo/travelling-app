import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Dimensions, StyleSheet, Platform } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import CustomText from '@/components/CustomText';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type FlightStats = {
  airport_name: string;
  country: string;
  flight_count: number;
};

const StatsScreen = () => {
  const [flightData, setFlightData] = useState<FlightStats[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/stats/flight-counts")
      .then((response) => response.json())
      .then((data) => setFlightData(data))
      .catch((error) => console.error("Error fetching flight data:", error));
  }, []);

  const calculateBarChartWidth = useCallback(() => {
    const screenWidth = Dimensions.get("window").width;
    const minWidth = screenWidth - 40;
    const labelLengths = flightData.map(label => label.airport_name.length);
    const maxLabelLength = Math.max(...labelLengths, 0);
    return Math.max(minWidth, maxLabelLength * 12 + 100);
  }, [flightData]);

  const labels = flightData.map(item => item.country);
  const values = flightData.map(item => item.flight_count);

  const colorPalette = ["#6c7ddf", "#6cccdf", "#52cd9b", "#b4baed", "#7d8ef2", "#5ad3c8"];

  const pieData = flightData.map((item, index) => ({
    name: `${item.airport_name} (${item.country})`,
    population: item.flight_count,
    color: colorPalette[index % colorPalette.length],
    legendFontColor: "#333",
    legendFontSize: 13,
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cards */}
        <View style={styles.statsCardsContainer}>
          <LinearGradient colors={["#6c7ddf", "#7d8ef2"]} style={styles.statsCard}>
            <MaterialIcons name="flight-land" size={24} color="white" />
            <View style={styles.statsCardContent}>
              <CustomText style={styles.statsCardTitle}>Aeropuertos</CustomText>
              <CustomText style={styles.statsCardValue}>{flightData.length}</CustomText>
            </View>
          </LinearGradient>

          <LinearGradient colors={["#52cd9b", "#5ad3c8"]} style={styles.statsCard}>
            <MaterialIcons name="flight" size={24} color="white" />
            <View style={styles.statsCardContent}>
              <CustomText style={styles.statsCardTitle}>Vuelos</CustomText>
              <CustomText style={styles.statsCardValue}>{values.reduce((a, b) => a + b, 0)}</CustomText>
            </View>
          </LinearGradient>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="bar-chart" size={24} color="#6c7ddf" />
            <CustomText style={styles.chartTitle}>Distribución de Vuelos</CustomText>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels,
                  datasets: [{ data: values }],
                }}
                width={calculateBarChartWidth()}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
                showValuesOnTopOfBars
                chartConfig={{
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 0,
                  color: () => 'rgba(108, 125, 223, 1)',
                  labelColor: () => "#424242",
                  propsForBackgroundLines: {
                    stroke: "#e0e0e0",
                    strokeDasharray: '5,5'
                  },
                  propsForLabels: {
                    fontSize: 12,
                    fontWeight: '500',
                  },
                }}
                style={styles.barChart}
                verticalLabelRotation={0}
              />
              
              {/* Espacio adicional para las etiquetas personalizadas */}
              <View style={styles.airportLabelsWrapper}>
                <View style={styles.airportLabelsContainer}>
                  {flightData.map((item, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.airportLabelBox,
                        { width: calculateBarChartWidth() / flightData.length }
                      ]}
                    >
                      <CustomText numberOfLines={2} style={styles.airportLabel}>
                        {item.airport_name}
                      </CustomText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Pie Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="pie-chart" size={24} color="#52cd9b" />
            <CustomText style={styles.chartTitle}>Vuelos por Aeropuertos</CustomText>
          </View>

          <View style={styles.chartContainer}>
            <PieChart
              data={pieData}
              width={Dimensions.get("window").width - 40}
              height={300}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="25"
              center={[10, 0]}
              absolute
              hasLegend={true}
              chartConfig={{
                color: () => '#333',
              }}
              style={styles.pieChart}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: '#f0f2f7',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsCardContent: {
    marginLeft: 10,
  },
  statsCardTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.8,
  },
  statsCardValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#424242',
  },
  chartContainer: {
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  barChart: {
    borderRadius: 12,
    marginBottom: 10,
  },
  pieChart: {
    borderRadius: 12,
  },
  airportLabelsWrapper: {
    width: '100%',
    paddingTop: 5,
  },
  airportLabelsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  airportLabelBox: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  airportLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#424242',
    fontWeight: '500',
  }
});

export default StatsScreen;