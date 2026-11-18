import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ModuleCard, { getStatus } from '../../components/ModuleCard';
import { colors } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

type Filter = 'all' | 'good' | 'warn' | 'bad';

const OPTIONS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'good', label: 'Good (70%+)' },
    { value: 'warn', label: 'Warning (50–69%)' },
    { value: 'bad', label: 'Low (below 50%)' },
];

export default function Modules() {
    const { modules } = useModules();
    const [filter, setFilter] = useState<Filter>('all');
    const [visible, setVisible] = useState(false);

    const shown =
        filter === 'all'
            ? modules : modules.filter((m) => getStatus(m.attended, m.held) === filter);

    const currentLabel = OPTIONS.find((o) => o.value === filter)?.label;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Link href="/module/add" asChild>
                    <Pressable style={styles.addButton}>
                        <Text style={styles.addText}>+ Add module</Text>
                    </Pressable>
                </Link>

                <Pressable style={styles.filterButton} onPress={() =>
                    setVisible(true)
                }>
                    <Text style={styles.filterText}>Filter: {currentLabel}</Text>
                </Pressable>
            </View>

            <FlatList
                data={shown}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={{ pathname: '/module/[id]', params: { id: item.id } }}
                        asChild>
                        <Pressable>
                            <ModuleCard module={item} />
                        </Pressable>
                    </Link>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No modules match this filter</Text>}
                contentContainerStyle={{ padding: 16 }}
            />

            <Modal
                visible={visible}
                transparent
                animationType='slide'
                onRequestClose={() => setVisible(false)}
            >
                <Pressable style={styles.backdrop} onPress={() =>
                    setVisible(false)
                }>
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>Filter modules</Text>
                        {OPTIONS.map((o) => (
                            <Pressable
                                key={o.value}
                                style={[styles.option, filter === o.value && styles.optionSelected]}
                                onPress={() => {
                                    setFilter(o.value);
                                    setVisible(false);
                                }}>
                                <Text style={[styles.optionText, filter === o.value && styles.optionSelectedText]}>
                                    {o.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginHorizontal: 16,
    },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: colors.navy,
    },
    addText: {
        color: colors.white,
        fontWeight: '600',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.subtle,
    },
    filterText: {
        color: colors.navy,
        fontWeight: '600',
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: colors.textGrey,
    },
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(15,23,42,0.5)',
    },
    sheet: {
        backgroundColor: colors.white,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 8,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    option: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: colors.background,
    },
    optionText: {
        color: colors.text,
        fontSize: 15,
    },
    optionSelected: {
        backgroundColor: colors.navy,
    },
    optionSelectedText: {
        color: colors.white,
        fontWeight: '600',
    },
});
