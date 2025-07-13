import DashboardPaidBills from "@/components/Dashboard/DashboardPaidBills";
import DashboardTables from "@/components/Dashboard/DashboardTables";
import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const periods = ["today", "week", "month", "all"] as const;

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof periods)[number]>("today");
  const history = useAppStore((state) => state.paidBills);
  const tables = useAppStore((state) => state.tables);
  const deleteTable = useAppStore((state) => state.deleteTable);
  const addToQueue = useOfflineStore((state) => state.addToQueue);

  const getHistoryByDate = (period: (typeof periods)[number]) => {
    const now = new Date();
    let startDate: Date;

    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      const day = now.getDay();
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - day
      );
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(0); // all
    }

    return history.filter((item: { date: string | Date }) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  };

  const todayHistory = getHistoryByDate(periods[0]) || [];
  const weekHistory = getHistoryByDate(periods[1]) || [];
  const monthHistory = getHistoryByDate(periods[2]) || [];

  const stats = {
    sales: {
      today: todayHistory.reduce(
        (sum, item) => sum + (item.total_bill || 0),
        0
      ),
      week: weekHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      month: monthHistory.reduce(
        (sum, item) => sum + (item.total_bill || 0),
        0
      ),
      all: history.reduce((sum, item) => sum + (item.total_bill || 0), 0),
    },
    frames: {
      today: todayHistory.reduce(
        (sum, item) => sum + (item.total_frame || 0),
        0
      ),
      week: weekHistory.reduce((sum, item) => sum + (item.total_frame || 0), 0),
      month: monthHistory.reduce(
        (sum, item) => sum + (item.total_frame || 0),
        0
      ),
      all: history.reduce((sum, item) => sum + (item.total_frame || 0), 0),
    },
    received: {
      today: todayHistory.reduce(
        (sum, item) => sum + (item.total_bill || 0),
        0
      ),
      week: weekHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      month: monthHistory.reduce(
        (sum, item) => sum + (item.total_bill || 0),
        0
      ),
      all: history.reduce((sum, item) => sum + (item.total_bill || 0), 0),
    },
  };

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tables" | "paidBills"
  >("dashboard");

  const renderTabContent = () => {
    if (activeTab === "dashboard") {
      return (
        <View>
          {/* Period Buttons */}
          <View style={styles.periodSelector}>
            {periods?.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.boxesContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Total Sales</Text>
              <Text style={styles.statValue}>
                Rs {stats.sales[selectedPeriod]}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Total Frames Played</Text>
              <Text style={styles.statValue}>
                {stats.frames[selectedPeriod]}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Received Amount</Text>
              <Text style={styles.statValue}>
                Rs {stats.received[selectedPeriod]}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    if (activeTab === "tables") {
      return <DashboardTables />;
    }
    if (activeTab === "paidBills") {
      return (
        <DashboardPaidBills />
      );
    }
    return null;
  };

  return (
    <>
      <View
        style={{
          backgroundColor: "#fff",
          flexDirection: "row",
          borderRadius: 20,
          margin: 16,
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        }}
      >
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 20,
            },
            activeTab === "dashboard" && { backgroundColor: "#1976D2" },
          ]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Text
            style={{
              color: activeTab === "dashboard" ? "#fff" : "#1976D2",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 20,
            },
            activeTab === "tables" && { backgroundColor: "#1976D2" },
          ]}
          onPress={() => setActiveTab("tables")}
        >
          <Text
            style={{
              color: activeTab === "tables" ? "#fff" : "#1976D2",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Tables
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 20,
            },
            activeTab === "paidBills" && { backgroundColor: "#1976D2" },
          ]}
          onPress={() => setActiveTab("paidBills")}
        >
          <Text
            style={{
              color: activeTab === "paidBills" ? "#fff" : "#1976D2",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Paid Bills
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 6,
  },
  periodButtonActive: {
    backgroundColor: "#1976D2",
  },
  periodButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: "#fff",
  },
  boxesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  statBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statTitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976D2",
  },
});
