import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    StatusBar,
    Platform,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import translations from '../utils/translations';

import NotificationScreen from './NotificationScreen';
import WeatherScreen from './WeatherScreen';

const { width } = Dimensions.get('window');

const HomeScreen = ({ user, onLogout, language = 'en' }: any) => {
    const [activeTab, setActiveTab] = useState('home');

    const t = (translations as any)[language] || translations.en;

    const stats = [
        { id: 1, label: t.waterLevel, value: '85%', icon: '💧', color: '#0288D1' },
        { id: 2, label: t.soilTemp, value: '24°C', icon: '🌡️', color: '#F57C00' },
        { id: 3, label: t.moisture, value: '62%', icon: '🌱', color: '#31AD33' },
        { id: 4, label: t.phLevel, value: '6.5', icon: '🧪', color: '#7B1FA2' },
    ];

    const quickActions = [
        { id: 1, title: t.manageCrops, icon: '🌾' },
        { id: 2, title: t.irrigation, icon: '💦' },
        { id: 3, title: t.market, icon: '📈' },
        { id: 4, title: t.weather, icon: '☀️' },
    ];

    const renderHome = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Professional App Header */}
            <AppHeader
                userName={user?.name || 'Farmer'}
                avatarText={user?.name?.charAt(0) || 'A'}
                onProfilePress={() => setActiveTab('profile')}
                onNotificationPress={() => setActiveTab('notifications')}
            />

            {/* Banner */}
            <View style={styles.bannerCard}>
                <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerTitle}>Aqua AgriLink</Text>
                    <Text style={styles.bannerSubtitle}>{t.smartFarming}</Text>
                </View>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.bannerIcon}
                    resizeMode="contain"
                />
            </View>

            {/* Stats Grid */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.realTimeMonitoring}</Text>
                <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
                {stats.map((stat) => (
                    <View key={stat.id} style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                            <Text style={styles.statIcon}>{stat.icon}</Text>
                        </View>
                        <View style={styles.statTextContainer}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>{t.quickActions}</Text>
            <View style={styles.actionsContainer}>
                {quickActions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={styles.actionButton}
                        onPress={() => {
                            if (action.id === 4) setActiveTab('weather');
                        }}
                    >
                        <View style={styles.actionCircle}>
                            <Text style={styles.actionIcon}>{action.icon}</Text>
                        </View>
                        <Text style={styles.actionTitle}>{action.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>{t.dailyInsights}</Text>
            <TouchableOpacity style={styles.insightCard}>
                <View style={styles.insightIconCircle}>
                    <Text style={styles.insightEmoji}>💡</Text>
                </View>
                <View style={styles.insightTextContent}>
                    <Text style={styles.insightTitle}>{t.optimalWatering}</Text>
                    <Text style={styles.insightDescription}>{t.wateringDesc}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.footerSpacer} />
        </ScrollView>
    );

    const renderTemperature = () => (
        <View style={styles.placeholderContainer}>
            <AppHeader
                title={t.analytics}
                showAvatar={false}
                onNotificationPress={() => setActiveTab('notifications')}
            />
            <View style={styles.centerContent}>
                <Text style={styles.placeholderIcon}>🌡️</Text>
                <Text style={styles.placeholderTitle}>{t.analytics}</Text>
                <Text style={styles.placeholderBody}>Explore precise climate heatmaps and historical data for your fields.</Text>
            </View>
        </View>
    );

    const renderMarket = () => (
        <View style={styles.placeholderContainer}>
            <AppHeader
                title={t.market}
                showAvatar={false}
                onNotificationPress={() => setActiveTab('notifications')}
            />
            <View style={styles.centerContent}>
                <Text style={styles.placeholderIcon}>📈</Text>
                <Text style={styles.placeholderTitle}>{t.market}</Text>
                <Text style={styles.placeholderBody}>Real-time mandi prices and wholesale rates for your region.</Text>
            </View>
        </View>
    );

    const renderProfile = () => (
        <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
                <View style={styles.largeAvatar}>
                    <Text style={styles.largeAvatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                </View>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>

            <View style={styles.profileMenu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>⚙️</Text>
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>📄</Text>
                    <Text style={styles.menuText}>Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>💬</Text>
                    <Text style={styles.menuText}>Help & Support</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtnFull} onPress={onLogout}>
                <Text style={styles.logoutBtnText}>{t.signOut}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return renderHome();
            case 'temp': return renderTemperature();
            case 'market': return renderMarket();
            case 'profile': return renderProfile();
            case 'notifications': return <NotificationScreen onBack={() => setActiveTab('home')} language={language} />;
            case 'weather': return <WeatherScreen onBack={() => setActiveTab('home')} user={user} language={language} />;
            default: return renderHome();
        }
    };

    const tabs = [
        { id: 'home', icon: '🏠', label: t.home },
        { id: 'temp', icon: '🌡️', label: t.analytics },
        { id: 'market', icon: '📈', label: t.market },
        { id: 'profile', icon: '👤', label: t.profile },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {renderContent()}

            {/* Professional Bottom Tab Bar */}
            {activeTab !== 'notifications' && (
                <View style={styles.bottomTabBar}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={styles.tabItem}
                            onPress={() => setActiveTab(tab.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconContainer}>
                                <Text style={[styles.tabIcon, activeTab === tab.id && styles.activeTabIcon]}>
                                    {tab.icon}
                                </Text>
                                {activeTab === tab.id && <View style={styles.activeDot} />}
                            </View>
                            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    scrollContent: {
        padding: 20,
    },
    bannerCard: {
        backgroundColor: '#004D40',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 6,
        shadowColor: '#004D40',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    bannerSubtitle: {
        fontSize: 15,
        color: '#B2DFDB',
        lineHeight: 22,
    },
    bannerIcon: {
        width: 90,
        height: 90,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    seeAll: {
        fontSize: 14,
        color: '#00796B',
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        width: (width - 55) / 2,
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statIcon: {
        fontSize: 20,
    },
    statTextContainer: {
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
    },
    statLabel: {
        fontSize: 11,
        color: '#757575',
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        elevation: 1,
    },
    actionButton: {
        alignItems: 'center',
        width: (width - 70) / 4,
    },
    actionCircle: {
        width: 50,
        height: 50,
        backgroundColor: '#F0F4F4',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionIcon: {
        fontSize: 22,
    },
    actionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
    },
    insightCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    insightIconCircle: {
        width: 50,
        height: 50,
        backgroundColor: '#FFF9C4',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    insightEmoji: {
        fontSize: 24,
    },
    insightTextContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
    },
    insightDescription: {
        fontSize: 13,
        color: '#757575',
        marginTop: 2,
    },
    placeholderContainer: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    placeholderIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    placeholderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004D40',
        marginBottom: 10,
    },
    placeholderBody: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 24,
    },
    profileContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 10,
        borderBottomColor: '#F7F8FA',
    },
    largeAvatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#00796B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 4,
        borderColor: '#E0F2F1',
    },
    largeAvatarText: {
        fontSize: 44,
        color: '#FFF',
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121',
    },
    profileEmail: {
        fontSize: 15,
        color: '#757575',
    },
    profileMenu: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    menuIcon: {
        fontSize: 22,
        marginRight: 15,
        width: 30,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutBtnFull: {
        margin: 20,
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#EF5350',
        padding: 16,
        borderRadius: 15,
        alignItems: 'center',
    },
    logoutBtnText: {
        color: '#EF5350',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerSpacer: {
        height: 100,
    },
    bottomTabBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 75,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
    },
    tabIcon: {
        fontSize: 24,
        color: '#9E9E9E',
    },
    activeTabIcon: {
        color: '#00796B',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#00796B',
        marginTop: 2,
    },
    tabLabel: {
        fontSize: 11,
        color: '#9E9E9E',
        marginTop: 4,
        fontWeight: '600',
    },
    activeTabLabel: {
        color: '#00796B',
    },
});

export default HomeScreen;
