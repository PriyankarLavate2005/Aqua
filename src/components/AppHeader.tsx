import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';

interface AppHeaderProps {
    title?: string;
    userName?: string;
    showNotification?: boolean;
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
    showAvatar?: boolean;
    avatarText?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    userName,
    showNotification = true,
    onNotificationPress,
    onProfilePress,
    showAvatar = true,
    avatarText,
}) => {
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {userName ? (
                    <View>
                        <Text style={styles.greetingText}>Welcome back,</Text>
                        <Text style={styles.userNameText}>{userName}</Text>
                    </View>
                ) : (
                    <Text style={styles.headerTitle}>{title || 'Aqua AgriLink'}</Text>
                )}
            </View>

            <View style={styles.rightContainer}>
                {showNotification && (
                    <TouchableOpacity style={styles.iconBtn} onPress={onNotificationPress}>
                        <Text style={styles.iconEmoji}>🔔</Text>
                        <View style={styles.badge} />
                    </TouchableOpacity>
                )}

                {showAvatar && (
                    <TouchableOpacity style={styles.profileBtn} onPress={onProfilePress}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{avatarText || 'U'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    leftContainer: {
        flex: 1,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    userNameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004D40',
    },
    iconBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconEmoji: {
        fontSize: 20,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        backgroundColor: '#FF5252',
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    profileBtn: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#00796B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AppHeader;
