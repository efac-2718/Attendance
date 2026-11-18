import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import type { Module } from '../context/ModulesContext';

export type Status = 'good' | 'warn' | 'bad';

export const STATUS_LABELS: Record<Status, string> = {
    good: 'Good',
    warn: 'Warning',
    bad: 'Low',
};

export function getStatus(attended: number, held: number): Status {
    if (held === 0) return 'good'; // no sessions yet, so nothing missed
    const percent = Math.round((attended / held) * 100);
    return percent < 50 ? 'bad' : percent < 70 ? 'warn' : 'good';
}

export default function ModuleCard({ module }: { module: Module }) {
    const { code, name, attended, held } = module;
    const percent = held === 0 ? 0 : Math.round((attended / held) * 100);
    const status = getStatus(attended, held);
    const color = colors[status];

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.titles}>
                    <Text style={styles.code}>{code}</Text>
                    <Text style={styles.name}>{name}</Text>
                </View>
                <Text style={styles.percent}>{held === 0 ? '–' : `${percent}%`}</Text>
            </View>

            <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
            </View>

            <View style={styles.bottomRow}>
                {/* '33' on the end of the colour = about 20% opacity */}
                <View style={[styles.chip, { backgroundColor: color + '33' }]}>
                    <Text style={[styles.chipText, { color }]}>
                        {held === 0 ? 'No sessions yet' : STATUS_LABELS[status]}
                    </Text>
                </View>
                <Text style={styles.sessions}>
                    {attended} of {held} sessions
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.navy,
        borderRadius: 14,
        padding: 18,
        marginBottom: 12,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titles: {
        flex: 1,
        marginRight: 12,
    },
    code: {
        fontSize: 13,
        color: colors.muted,
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.white,
        marginTop: 2,
    },
    percent: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.white,
    },
    track: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.navyLight,
        marginTop: 14,
        overflow: 'hidden',
    },
    fill: {
        height: 8,
        borderRadius: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sessions: {
        fontSize: 13,
        color: colors.subtle,
    },
});
