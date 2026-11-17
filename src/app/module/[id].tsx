import { useLocalSearchParams } from "expo-router";
import { Text, View } from 'react-native';

export default function ModuleDetails() {
    const { id } = useLocalSearchParams();
    return (
        <View style={{ padding: 16 }}>
            <Text>Module {id}</Text>
        </View>
    );
}