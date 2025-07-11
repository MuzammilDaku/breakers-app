import { Table, useAppStore } from '@/context/appStore';
import { useOfflineStore } from '@/context/offlineStore';
import { baseUrl } from '@/services/base';
import { DeleteTable } from '@/services/table';
import { getRandomId } from '@/services/utilities/getRandomId';
import { isInternetConnected } from '@/services/utilities/isInternetConnected';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from 'react-native-paper';

const periods = ['today', 'week', 'month', 'all'] as const;

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<typeof periods[number]>('today');
  const history = useAppStore((state) => state.paidBills);
  const tables = useAppStore((state) => state.tables);
  const deleteTable = useAppStore((state) => state.deleteTable);
  const addToQueue = useOfflineStore((state) => state.addToQueue);

  const getHistoryByDate = (period: typeof periods[number]) => {
    const now = new Date();
    let startDate: Date;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      const day = now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    } else if (period === 'month') {
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
      today: todayHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      week: weekHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      month: monthHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      all: history.reduce((sum, item) => sum + (item.total_bill || 0), 0),
    },
    frames: {
      today: todayHistory.reduce((sum, item) => sum + (item.total_frame || 0), 0),
      week: weekHistory.reduce((sum, item) => sum + (item.total_frame || 0), 0),
      month: monthHistory.reduce((sum, item) => sum + (item.total_frame || 0), 0),
      all: history.reduce((sum, item) => sum + (item.total_frame || 0), 0),
    },
    received: {
      today: todayHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      week: weekHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      month: monthHistory.reduce((sum, item) => sum + (item.total_bill || 0), 0),
      all: history.reduce((sum, item) => sum + (item.total_bill || 0), 0),
    },
  };

  const handleDelete = async (table: Table) => {
    if (!table._id) return;
    try {
      const isConnected = await isInternetConnected();

      if (isConnected) {
        await DeleteTable({ _id: table._id });
      } else {
        await addToQueue({
          method: 'DELETE',
          url: baseUrl + '/table',
          body: { _id: table._id },
          id: getRandomId(),
        });
      }
      deleteTable(table);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: { item: Table }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item?.name}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            router.navigate({
              pathname: '/create-table',
              params: { table: JSON.stringify(item) },
            });
          }}
        >
          <Ionicons name="create-outline" color="blue" size={20} style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Delete Table', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item) },
            ]);
          }}
        >
          <Ionicons name="trash-outline" color="blue" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F8FA' }}>
      <View style={styles.container}>
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
            <Text style={styles.statValue}>Rs {stats.sales[selectedPeriod]}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Frames Played</Text>
            <Text style={styles.statValue}>{stats.frames[selectedPeriod]}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Received Amount</Text>
            <Text style={styles.statValue}>Rs {stats.received[selectedPeriod]}</Text>
          </View>
        </View>

        {/* Table List Header */}
        <View style={styles.listHeader}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tables</Text>
          <Button
            mode="contained"
            onPress={() => router.navigate('/create-table')}
            style={{ backgroundColor: '#475ba3' }}
            labelStyle={{ color: 'white' }}
          >
            Add Table
          </Button>
        </View>
        <FlatList
          data={tables}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 6,
  },
  periodButtonActive: {
    backgroundColor: '#1976D2',
  },
  periodButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  boxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableRow: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableCell: {
    fontSize: 16,
  },
});
