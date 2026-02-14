import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import translations from '../utils/translations';

const LoginScreen = ({ onRegisterPress, onLoginSuccess, language = 'en' }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const t = (translations as any)[language] || translations.en;

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const data = await api.login(email, password);
            setLoading(false);
            Alert.alert('Success', data.message || 'Login Successful');
            onLoginSuccess(data);
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Error', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{t.welcomeBack}</Text>
            <Text style={styles.subHeader}>{t.loginToAccount}</Text>

            <TextInput
                style={styles.input}
                placeholder={t.email}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder={t.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{t.login}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onRegisterPress}>
                <Text style={styles.footerText}>
                    {t.noAccount} <Text style={styles.linkText}>{t.register}</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#004D40',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#00796B',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#666',
    },
    linkText: {
        color: '#00796B',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
