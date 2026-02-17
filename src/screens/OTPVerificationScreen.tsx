import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';

interface OTPVerificationScreenProps {
    email: string;
    onVerifySuccess: (data: any) => void;
    onResendOTP: () => void;
    language: string;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ email, onVerifySuccess, onResendOTP, language }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://10.0.2.2:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Verification successful!');
                onVerifySuccess(data);
            } else {
                Alert.alert('Error', data.message || 'Invalid OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3596/3596009.png' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#666"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                    textAlign="center"
                    letterSpacing={5}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Verify & Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={onResendOTP} style={styles.resendButton}>
                    <Text style={styles.resendText}>Didn't receive code? Resend</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        tintColor: '#2C5F2D',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C5F2D',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        backgroundColor: '#2C5F2D',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    resendText: {
        color: '#2C5F2D',
        fontSize: 16,
    },
});

export default OTPVerificationScreen;
