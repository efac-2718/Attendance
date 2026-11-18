import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/theme';
import { useModules } from '../../context/ModulesContext';

export default function AddModule() {
  const { addModule } = useModules();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const save = () => {
    if (!code.trim() || !name.trim()) {
      Alert.alert('Missing details', 'Please enter both the module code and name.');
      return;
    }
    addModule(code.trim(), name.trim());
    router.back(); // return to the list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New module</Text>
      <Text style={styles.hint}>It starts at 0 sessions. Mark attendance from its page.</Text>

      <Text style={styles.label}>Module code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. COSC 32223"
        placeholderTextColor={colors.muted}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Module name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Software Engineering"
        placeholderTextColor={colors.muted}
        value={name}
        onChangeText={setName}
      />

      <Pressable
        style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
        onPress={save}
      >
        <Text style={styles.saveText}>Save module</Text>
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  hint: {
    fontSize: 14,
    color: colors.textGrey,
    marginTop: 4,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.subtle,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.navy,
  },
  saveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
  },
});
