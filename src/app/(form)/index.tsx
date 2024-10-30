import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function FormIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.regularText}>This is Outfit Regular</Text>
      <Text style={styles.boldText}>This is Outfit Bold</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regularText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 30,
  },
  boldText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 30,
  },
});
