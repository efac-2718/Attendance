import { Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { getStatus, STATUS_LABELS } from '../../components/ModuleCard';
import { colors } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';
import { scheduleReminder } from '../../utils/notifications';

export default function ModuleDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { modules, markAttendance } = useModules();
  const module = modules.find((m) => m.id === id);

  if (!module) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Module not found</Text>
      </View>
    );
  }

  const percent =
    module.held === 0 ? 0 : Math.round((module.attended / module.held) * 100);
  const status = getStatus(module.attended, module.held);
  const color = colors[status];

  const remind = async () => {
    const ok = await scheduleReminder(module.name, percent);
    Alert.alert(
      ok ? 'Reminder set' : 'Permission needed',
      ok ? 'You will get a notification in 5 seconds.' : 'Enable notifications to get reminders.'
    );
  };

  return (
    <View style={styles.container}>
      {/* Show the module code in the header instead of "Module" */}
      <Stack.Screen options={{ title: module.code }} />

      <Text style={styles.name}>{module.name}</Text>
      <Text style={styles.code}>{module.code}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Attendance</Text>
        <Text style={styles.cardValue}>{module.held === 0 ? '–' : `${percent}%`}</Text>
        <Text style={styles.cardSub}>
          {module.attended} of {module.held} sessions attended
        </Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
        </View>

        <View style={[styles.chip, { backgroundColor: color + '33' }]}>
          <Text style={[styles.chipText, { color }]}>
            {module.held === 0 ? 'No sessions yet' : STATUS_LABELS[status]}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{"Mark today's class"}</Text>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: colors.good }, pressed && styles.pressed]}
          onPress={() => markAttendance(module.id, true)}
        >
          <Text style={styles.buttonText}>Present</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: colors.bad }, pressed && styles.pressed]}
          onPress={() => markAttendance(module.id, false)}
        >
          <Text style={styles.buttonText}>Absent</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.remindButton, pressed && styles.pressed]}
        onPress={remind}
      >
        <Text style={styles.remindText}>Remind me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  notFound: {
    color: colors.textGrey,
    textAlign: 'center',
    marginTop: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  code: {
    fontSize: 14,
    color: colors.textGrey,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    padding: 20,
    marginTop: 20,
  },
  cardLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  cardValue: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cardSub: {
    color: colors.subtle,
    fontSize: 13,
    marginTop: 4,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.navyLight,
    marginTop: 16,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 12,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  remindButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.navy,
  },
  remindText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
  },
});
