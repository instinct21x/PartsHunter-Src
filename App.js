import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { startTimer, endTimer } from './utils/performanceTracker';
import { Provider as PaperProvider } from 'react-native-paper';

// Import screen components
import HomeScreen from './screens/HomeScreen';
import CarManagementScreen from './screens/CarManagementScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MaintenanceSchedulerScreen from './screens/MaintenanceSchedulerScreen';
import InstallationGuidesScreen from './screens/InstallationGuidesScreen';
import TipsScreen from './screens/TipsScreen';
import NearbyCarsScreen from './screens/NearbyCarsScreen';

// Import context providers
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const DIYStack = createNativeStackNavigator();

function DIYStackNavigator() {
  return (
    <DIYStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Maintenance"
    >
      <DIYStack.Screen
        name="Maintenance"
        component={MaintenanceSchedulerScreen}
      />
      <DIYStack.Screen
        name="InstallationGuides"
        component={InstallationGuidesScreen}
      />
      <DIYStack.Screen name="Tips" component={TipsScreen} />
    </DIYStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Nearby Cars') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          } else if (route.name === 'Car Management') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'DIY & Recommendations') {
            iconName = focused ? 'build' : 'build-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Nearby Cars" component={NearbyCarsScreen} />
      <Tab.Screen name="Car Management" component={CarManagementScreen} />
      <Tab.Screen name="DIY & Recommendations" component={DIYStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={currentUser ? 'Main' : 'Login'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main">
        {(props) => <MainTabs {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  useEffect(() => {
    startTimer('App Startup');
    
    return () => {
      endTimer('App Startup');
    };
  }, []);

  return (
    <PaperProvider>
      <CartProvider>
        <LanguageProvider>
          <SafeAreaProvider>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <RootNavigator />
              </NavigationContainer>
            </AuthProvider>
          </SafeAreaProvider>
        </LanguageProvider>
      </CartProvider>
    </PaperProvider>
  );
}
