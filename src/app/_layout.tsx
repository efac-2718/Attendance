import { ModulesProvider } from '@/context/ModulesContext';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { setupNotificationHandler } from '../utils/notifications';

setupNotificationHandler();

export default function TabLayout() {
  return (
    <ModulesProvider>
    <Tabs screenOptions={{tabBarActiveTintColor: '#FFFFFF' , tabBarStyle: {
      backgroundColor: "#1E293B",
      borderTopWidth: 0,
      height: 75},
      tabBarInactiveTintColor: '#94A3B8',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerStyle: {
        backgroundColor: '#1E293B'
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
      }, 
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      
    }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Today', tabBarIcon: ({color, size, focused}) => (
          <MaterialCommunityIcons
            name={focused ? "calendar-today" : "calendar-today-outline"}
            color={typeof color === 'string' ? color : undefined}
            size={size}
          />
        )}}
        />
      <Tabs.Screen
        name="module"
        options={{ title: 'Modules', headerShown: false, tabBarIcon: ({color, size}) => (
          <FontAwesome6 name="graduation-cap" size={size} color={color} />
        )}}
        />
    </Tabs>
    </ModulesProvider>
    )
}
