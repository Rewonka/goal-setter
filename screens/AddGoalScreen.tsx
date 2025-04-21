import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGoals } from '../GoalContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddGoal'>;

export default function AddGoalScreen({ navigation }: Props) {
  const { addGoal } = useGoals();
  const [title, setTitle] = useState('');

  const save = () => {
    addGoal(title.trim());
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Goal</Text>

      <TextInput
        placeholder="Goal title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Pressable
        onPress={save}
        style={[
          styles.button,
          { opacity: title.trim() ? 1 : 0.4 },
        ]}
        disabled={!title.trim()}
      >
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
  input: {
    width: '80%',
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#0077ff',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
