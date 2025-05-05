import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGoals, Goal } from '../GoalContext';
import BadgeModal from '../component/BadgeModal';


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { goals, toggleDone, deleteGoal } = useGoals();
  const { showActionSheetWithOptions } = useActionSheet();

  /* (2) local state that controls the modal */
  const [badge, setBadge] = useState<{ title: string; streak: number } | null>(
    null
  );
  
  const handleLongPress = (item: Goal) => {
    const options = ['Delete Goal', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      { options, cancelButtonIndex, destructiveButtonIndex },
      buttonIndex => {
        if (buttonIndex === destructiveButtonIndex) {
          deleteGoal(item.id);
        }
      }
    );
  };

  /* (3) helper that wraps toggleDone and, if success, opens the modal */
  const handleToggle = (item: Goal) => {
    if (!item.doneToday) {
      // only pop the badge when checking (not un‑checking)
      toggleDone(item.id);

      // figure out next streak = current streak + 1  (because it wasn't done yet)
      const nextStreak = item.streak + 1;
      setBadge({ title: item.title, streak: nextStreak });
    } else {
      // un‑checking
      toggleDone(item.id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Today's Goals</Text>

      <FlatList
        data={goals}
        keyExtractor={g => g.id}
        renderItem={({ item }) => (
            <Pressable
            onPress={() => handleToggle(item)}
            onLongPress={() => handleLongPress(item)}
            style={styles.goalRow}
          >
            <Checkbox value={item.doneToday} />
            <Text style={{ marginLeft: 12 }}>{item.title} - Day {item.streak}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>No goals yet.</Text>}
        style={{ width: '100%' }}
        contentContainerStyle={{ padding: 16 }}
      />

      <Pressable
        onPress={() => navigation.navigate('AddGoal')}
        style={styles.fab}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      {badge && (
        <BadgeModal
          visible
          streak={badge.streak}
          onClose={() => setBadge(null)}   // reset local state
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, textAlign: 'center', marginVertical: 16 },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  fab: {
    position: 'absolute',
    bottom: 62,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0077ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 32 },
});
