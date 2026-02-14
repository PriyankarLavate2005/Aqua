import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Language {
    id: string;
    name: string;
    nativeName: string;
    flag: string;
}

const languages: Language[] = [
    { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

const LanguageSelectionScreen = ({ onLanguageSelect }: { onLanguageSelect: (lang: string) => void }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Select Language</Text>
                <Text style={styles.subtitle}>Choose your preferred language to continue</Text>

                <View style={styles.langList}>
                    {languages.map((lang) => (
                        <TouchableOpacity
                            key={lang.id}
                            style={styles.langButton}
                            onPress={() => onLanguageSelect(lang.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.langInfo}>
                                <Text style={styles.flag}>{lang.flag}</Text>
                                <View>
                                    <Text style={styles.nativeName}>{lang.nativeName}</Text>
                                    <Text style={styles.langName}>{lang.name}</Text>
                                </View>
                            </View>
                            <View style={styles.arrowContainer}>
                                <Text style={styles.arrow}>→</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.footerText}>
                    You can change this later in settings
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    langList: {
        width: '100%',
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FB',
        padding: 18,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F1F3',
    },
    langInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        fontSize: 24,
        marginRight: 16,
    },
    nativeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    langName: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#00796B10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        fontSize: 18,
        color: '#00796B',
        fontWeight: 'bold',
    },
    footerText: {
        marginTop: 30,
        color: '#999',
        fontSize: 14,
    },
});

export default LanguageSelectionScreen;
