import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Alert,
    Dimensions
} from 'react-native';
import AppHeader from '../components/AppHeader';
import translations from '../utils/translations';

const { width } = Dimensions.get('window');

interface WeatherScreenProps {
    onBack: () => void;
    user?: any;
    language?: string;
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ onBack, user, language = 'en' }) => {
    // Default to user's city if available, otherwise 'New York' as per requirement/example
    const [city, setCity] = useState(user?.city || user?.location || 'New York');
    const [weatherData, setWeatherData] = useState<any>(null);
    const [forecastData, setForecastData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiKey = '0c005fa00b6a2d265bfea09a97e0d15f';
    const t = (translations as any)[language] || translations.en;

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        if (!city.trim()) {
            setError('Please enter a city name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get current weather
            const currentWeatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

            if (!currentWeatherResponse.ok) {
                const errorData = await currentWeatherResponse.json();
                throw new Error(errorData.message || 'City not found');
            }

            const currentWeatherData = await currentWeatherResponse.json();
            setWeatherData(currentWeatherData);

            // Get forecast
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
            );

            if (!forecastResponse.ok) {
                throw new Error('Forecast data not available');
            }

            const forecastData = await forecastResponse.json();
            setForecastData(forecastData);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const processForecastData = (forecastList: any[]) => {
        const dailyForecasts: any[] = [];
        const dates: { [key: string]: any } = {};

        // Group forecasts by day and select one forecast per day (noon)
        forecastList.forEach((item) => {
            const date = new Date(item.dt * 1000).toDateString();
            // If we haven't seen this date or this is closer to noon
            if (
                !dates[date] ||
                Math.abs(new Date(item.dt * 1000).getHours() - 12) <
                Math.abs(new Date(dates[date].dt * 1000).getHours() - 12)
            ) {
                dates[date] = item;
            }
        });

        // Convert to array and take first 5 days
        for (const date in dates) {
            dailyForecasts.push(dates[date]);
            if (dailyForecasts.length >= 5) break;
        }

        return dailyForecasts;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <AppHeader
                title={t.weather || 'Weather'}
                showAvatar={false}
                showNotification={false}
            />

            <View style={styles.content}>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                        placeholder="Enter city name..."
                        placeholderTextColor="#999"
                        onSubmitEditing={fetchWeather}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={fetchWeather}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00796B" />
                        <Text style={styles.loadingText}>Loading weather data...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {error}</Text>
                    </View>
                )}

                {!loading && !error && weatherData && forecastData && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.currentWeather}>
                            <Text style={styles.cityName}>
                                {weatherData.name}, {weatherData.sys.country}
                            </Text>
                            <View style={styles.weatherInfo}>
                                <View style={styles.mainInfo}>
                                    <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
                                    <Text style={styles.description}>{weatherData.weather[0].description}</Text>
                                </View>
                                <Image
                                    style={styles.weatherIcon}
                                    source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` }}
                                />
                            </View>
                            <View style={styles.detailsGrid}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Feels like</Text>
                                    <Text style={styles.detailValue}>{Math.round(weatherData.main.feels_like)}°C</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Humidity</Text>
                                    <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Wind</Text>
                                    <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
                        <View style={styles.forecastList}>
                            {processForecastData(forecastData.list).map((day) => (
                                <View key={day.dt} style={styles.forecastItem}>
                                    <Text style={styles.forecastDate}>{formatDate(day.dt)}</Text>
                                    <Image
                                        style={styles.forecastIcon}
                                        source={{ uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png` }}
                                    />
                                    <Text style={styles.forecastTemp}>
                                        {Math.round(day.main.temp_max)}° / {Math.round(day.main.temp_min)}°
                                    </Text>
                                    <Text style={styles.forecastDesc}>{day.weather[0].description}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </View>

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
    content: {
        flex: 1,
        padding: 20,
    },
    searchBox: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        marginRight: 10,
        elevation: 2,
    },
    searchButton: {
        backgroundColor: '#00796B',
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 20,
        elevation: 2,
    },
    searchButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 16,
        textAlign: 'center',
    },
    currentWeather: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cityName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 10,
        textAlign: 'center',
    },
    weatherInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    mainInfo: {
        flex: 1,
    },
    temp: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#00796B',
    },
    description: {
        fontSize: 18,
        color: '#666',
        marginTop: 5,
        textTransform: 'capitalize',
    },
    weatherIcon: {
        width: 100,
        height: 100,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 15,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
    },
    forecastTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 15,
    },
    forecastList: {
        marginBottom: 20,
    },
    forecastItem: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
    },
    forecastDate: {
        width: 80,
        fontSize: 14,
        fontWeight: '600',
        color: '#424242',
    },
    forecastIcon: {
        width: 40,
        height: 40,
    },
    forecastTemp: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#212121',
        width: 80,
        textAlign: 'center',
    },
    forecastDesc: {
        flex: 1,
        fontSize: 12,
        color: '#757575',
        textAlign: 'right',
        textTransform: 'capitalize',
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
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WeatherScreen;
