import { Stack } from 'expo-router';

export default function ModuleStack() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#1E293B' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Modules' }} />
            <Stack.Screen name="[id]" options={{ title: 'Module' }} />
            <Stack.Screen name="add" options={{ title: 'Add module' }} />
        </Stack>
    );
}
