import { StyleSheet, Text, View } from 'react-native';

type Module = {
    id: string;
    code: String;
    name: string;
    attended: number;
    held: number;
};

export default function ModuleCard({ module }: { module: Module }) {
    const { code , name, attended, held} = module;
    const percent = held === 0 ? 0 : Math.round((attended / held) * 100);

    const status = percent < 50 ? 'bad' : (percent < 70 && percent > 50) ? 'warn' : 'good';

    const colors = {
        good: { bar: '#15803D' },
        warn: { bar: '#92400E' },
        bad:  { bar: '#B91C1C' },
    }[status];

    return(
        <View style={styles.card}>
            <Text style={styles.code}>{code}</Text>
            <Text style={styles.name}>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f3de25',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },
})