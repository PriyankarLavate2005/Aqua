import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    RefreshControl,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import { getNotifications, markAsRead, markAllAsRead, clearAllNotifications } from '../services/api';
import translations from '../utils/translations';

interface Notification {
    _id: string;
    type: 'pump_on' | 'pump_off' | 'temperature_alert' | 'temperature_normal';
    title: string;
    message: string;
    temperature?: number;
    isRead: boolean;
    timestamp: string;
    createdAt: string;
}

interface NotificationScreenProps {
    onBack: () => void;
    language?: string;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onBack, language = 'en' }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const t = (translations as any)[language] || translations.en;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            if (response.success) {
                setNotifications(response.data);
                setUnreadCount(response.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to clear all notifications? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearAllNotifications();
                            setNotifications([]);
                            setUnreadCount(0);
                        } catch (error) {
                            console.error('Error clearing notifications:', error);
                        }
                    },
                },
            ]
        );
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'pump_on':
                return '💧';
            case 'pump_off':
                return '🔴';
            case 'temperature_alert':
                return '🌡️';
            case 'temperature_normal':
                return '✅';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'pump_on':
                return '#0288D1';
            case 'pump_off':
                return '#EF5350';
            case 'temperature_alert':
                return '#FF9800';
            case 'temperature_normal':
                return '#4CAF50';
            default:
                return '#757575';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        const color = getNotificationColor(item.type);
        const icon = getNotificationIcon(item.type);

        return (
            <TouchableOpacity
                style={[
                    styles.notificationCard,
                    !item.isRead && styles.unreadCard,
                ]}
                onPress={() => !item.isRead && handleMarkAsRead(item._id)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <Text style={styles.notificationIcon}>{icon}</Text>
                </View>
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        {!item.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    {item.temperature && (
                        <Text style={styles.temperatureText}>
                            Temperature: {item.temperature}°C
                        </Text>
                    )}
                    <Text style={styles.timestampText}>
                        {formatTimestamp(item.timestamp || item.createdAt)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
                You're all caught up! Notifications about pump status and temperature alerts will appear here.
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                <AppHeader title="Notifications" showAvatar={false} showNotification={false} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00796B" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <AppHeader
                title="Notifications"
                showAvatar={false}
                showNotification={false}
            />

            {notifications.length > 0 && (
                <View style={styles.actionBar}>
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                            {unreadCount} Unread
                        </Text>
                    </View>
                    <View style={styles.actionButtons}>
                        {unreadCount > 0 && (
                            <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.actionBtn}>
                                <Text style={styles.actionBtnText}>Mark All Read</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
                            <Text style={styles.clearBtnText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#00796B']}
                        tintColor="#00796B"
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    unreadBadge: {
        backgroundColor: '#00796B15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    unreadText: {
        color: '#00796B',
        fontSize: 13,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    actionBtnText: {
        color: '#00796B',
        fontSize: 13,
        fontWeight: '600',
    },
    clearBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    clearBtnText: {
        color: '#EF5350',
        fontSize: 13,
        fontWeight: '600',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#00796B',
        backgroundColor: '#F0F9F8',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationIcon: {
        fontSize: 24,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00796B',
        marginLeft: 8,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#616161',
        lineHeight: 20,
        marginBottom: 4,
    },
    temperatureText: {
        fontSize: 13,
        color: '#FF9800',
        fontWeight: '600',
        marginBottom: 4,
    },
    timestampText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
        opacity: 0.3,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 10,
    },
    emptyMessage: {
        fontSize: 15,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 22,
    },
    backButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#00796B',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NotificationScreen;
