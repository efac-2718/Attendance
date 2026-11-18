import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, StyleSheet, Text, View } from "react-native";
import { useModules } from '../context/ModulesContext';

export default function Today() {

  const { modules } = useModules();
  const [now, setNow] = useState(new Date());
  const [welcomeBack, setWelcomeBack] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) =>{
      if (appState.current?.match(/inactive|background/) && nextState === 'active') {
        setNow(new Date());
        setWelcomeBack(true);
        setTimeout(() => setWelcomeBack(false), 3000);
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  const totalAttended = modules.reduce((sum, m) => sum + m.attended, 0);
  const totalHeld = modules.reduce((sum, m) => sum + m.held, 0)
  const overall = totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

  return (
    <View style={styles.container}>
      {welcomeBack && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Welcome back! Updated just now.
          </Text>
        </View>
      )}

      <Text style={styles.date}>
        {now.toLocaleDateString(undefined, { weekday: 'long', day:
          'numeric', month: 'long'
        })}
      </Text>
      <Text style={styles.time}>
        Last updated {now.toLocaleTimeString([], { hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Overall attendance</Text>
        <Text style={styles.cardValue}>{overall}%</Text>
        <Text style={styles.cardSub}>{totalAttended} of {totalHeld} sessions across {modules.length} modules</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  bannerText: {
    color: '#166534', 
    fontWeight: '600', 
    textAlign: 'center'
  },
  date: {
    fontSize: 22, 
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14, 
    color: '#78716C', 
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 20,
    marginTop: 20,
  },
  cardValue: {
    color: '#FFFFFF', 
    fontSize: 40, 
    fontWeight: 'bold', 
    marginTop: 4
  },
  cardLabel: {
    color: '#94A3B8', 
    fontSize: 14,
  },
  cardSub: {
     color: '#CBD5E1', 
     fontSize: 13, 
     marginTop: 4
  }

});
