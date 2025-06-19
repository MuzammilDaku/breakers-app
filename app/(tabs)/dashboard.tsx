import { useAppStore } from '@/context/appStore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const statsData = [
    {
        title: 'Total Sales',
        unit: 'Rs',
        values: { today: 1200, week: 8500, month: 32000, all: 350000 },
    },
    {
        title: 'Frames Sold',
        unit: '',
        values: { today: 18, week: 110, month: 420, all: 45000000 },
    },
    // Add more boxes as needed
];

const periods = ['today', 'week', 'month', 'all'] as const;

export default function Dashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState<typeof periods[number]>('today');
    console.log(selectedPeriod)
    const { history } = useAppStore()
    // console.log(history)
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
            // 'all'
            startDate = new Date(0);
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
            today: todayHistory?.reduce((sum, item) => sum + (item.total_bill || 0), 0),
            week: weekHistory?.reduce((sum, item) => sum + (item.total_bill || 0), 0),
            month: monthHistory?.reduce((sum, item) => sum + (item.total_bill || 0), 0),
            all: (history || []).reduce((sum, item) => sum + (item.total_bill || 0), 0),
        },
        frames: {
            today: todayHistory?.reduce((sum, item) => sum + (item.total_frame || 0), 0),
            week: weekHistory?.reduce((sum, item) => sum + (item.total_frame || 0), 0),
            month: monthHistory?.reduce((sum, item) => sum + (item.total_frame || 0), 0),
            all: (history || []).reduce((sum, item) => sum + (item.total_frame || 0), 0),
        },
        received: {
            today: todayHistory?.reduce((sum, item) => sum + (item.received_amount || 0), 0),
            week: weekHistory?.reduce((sum, item) => sum + (item.received_amount || 0), 0),
            month: monthHistory?.reduce((sum, item) => sum + (item.received_amount || 0), 0),
            all: (history || []).reduce((sum, item) => sum + (item.received_amount || 0), 0),
        }
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Dashboard</Text>
                <View style={styles.periodSelector}>
                    {periods.map(period => (
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

            </ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F6F8FA',
        flexGrow: 1,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 18,
        color: '#222',
        alignSelf: 'center',
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
});