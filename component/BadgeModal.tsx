import React from 'react';
import { Modal, Pressable, StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

type Props = {
  visible: boolean;
  streak: number;
  onClose: () => void;
};

export default function BadgeModal({ visible, streak, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.card}>
          <LottieView
            source={require('../assets/medal.json')}
            autoPlay
            loop={false}
            style={{ width: 180, height: 180 }}
          />
          <Text style={styles.text}>Day {streak} ✔️</Text>
          <Text>Great job!</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    width: 240,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text: { fontSize: 24, marginTop: 12, marginBottom: 8 },
});
