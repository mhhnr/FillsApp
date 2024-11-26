import React from 'react';
import { View } from 'react-native';

export default function TemplatesLayout({ children }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
}