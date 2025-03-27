import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Dimensions, StyleSheet, Platform } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import CustomText from '@/components/CustomText';

const StatsScreen = () => {
  const [flightData, setFlightData] = useState<{
    airport_name: string;
    country: string;
    flight_count: number;
  }[]>([]);
  
  useEffect(() => {
    fetch("http://localhost:3000/api/stats/flight-counts")
      .then((response) => response.json())
      .then((data) => setFlightData(data))
      .catch((error) => console.error("Error fetching flight data:", error));
  }, []);

  const calculateBarChartWidth = useCallback(() => {
    const screenWidth = Dimensions.get("window").width;
    const minWidth = screenWidth - 40;
    const labelLengths = flightData.map(label => 
      `${label.airport_name} (${label.country})`.length
    );
    const maxLabelLength = Math.max(...labelLengths);
    return Math.max(minWidth, maxLabelLength * 15 + 100);
  }, [flightData]);

  const labels = flightData.map(item =>
    `${item.airport_name} (${item.country})`
  );

  const values = flightData.map(item => item.flight_count);

  const colorPalette = [
    "#6c7ddf",
    "#6cccdf",
    "#52cd9b",
    "#b4baed",
    "#7d8ef2",
    "#5ad3c8",
  ];

  const pieData = flightData.map((item, index) => ({
    name: `${item.airport_name} (${item.country})`,
    population: item.flight_count,
    color: colorPalette[index % colorPalette.length],
    legendFontColor: "#333",
    legendFontSize: 15,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.headerContainer}>
        <CustomText style={styles.title}>Estadísticas de Vuelos</CustomText>
        <View style={styles.subtitleUnderline} />
      </View>

      {labels.length > 0 && values.length > 0 && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartScrollContainer}
          >
            <BarChart
              data={{
                labels,
                datasets: [{ data: values }]
              }}
              width={calculateBarChartWidth()}
              height={400}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars={true}
              withCustomBarColorFromData={false}
              flatColor={false}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(108, 125, 223, ${opacity})`,
                labelColor: () => "#424242",
                fillShadowGradient: "#6c7ddf",
                fillShadowGradientOpacity: 1,
                propsForBackgroundLines: {
                  stroke: "#e0e0e0",
                  strokeWidth: 1,
                },
                propsForLabels: {
                  fontSize: 13,
                  fontWeight: '500',
                },
                style: {
                  borderRadius: 16,
                }
              }}
              style={{
                borderRadius: 16,
                marginVertical: 12,
                elevation: Platform.OS === 'android' ? 8 : 0,
                shadowColor: "#6c7ddf",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                backgroundColor: 'white',
                paddingRight: 20,
              }}
              verticalLabelRotation={labels.some(l => l.length > 20) ? -45 : 0}
              xLabelsOffset={-10}
              yAxisInterval={1}
            />
          </ScrollView>

          <View style={styles.decorativeSeparator} />

          <View style={styles.pieChartHeader}>
            <CustomText style={styles.subtitle}>
              Distribución de Vuelos por Aeropuerto
            </CustomText>
            <View style={styles.subtitleUnderline} />
          </View>

          {pieData.length > 0 && (
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieData}
                width={Dimensions.get("window").width - 40}
                height={300}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="25"
                center={[10, 10]}
                absolute
                hasLegend={true}
                chartConfig={{
                  color: (opacity = 1) => `rgba(108, 125, 223, ${opacity})`,
                }}
                style={styles.pieChart}
                avoidFalseZero
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#6c7ddf",
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitleUnderline: {
    height: 4,
    width: 120,
    backgroundColor: "#52cd9b",
    borderRadius: 2,
  },
  chartScrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
  pieChartHeader: {
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#52cd9b",
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  pieChart: {
    borderRadius: 16,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: "#6c7ddf",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: 'white',
    padding: 10,
  },
  decorativeSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 25,
    opacity: 0.3,
  },
});

export default StatsScreen;