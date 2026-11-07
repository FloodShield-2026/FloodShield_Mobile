import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { colors } from '@/theme/colors';

export type TabIconName = keyof typeof Ionicons.glyphMap;

type Props = {
  label: string;
  icon: TabIconName;
  iconFocused: TabIconName;
  focused: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
};
export function TabBarButton({ label, icon, iconFocused, focused, onPress, onLongPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={[styles.chip, focused && styles.chipFocused]}>
        <Ionicons
          name={focused ? iconFocused : icon}
          size={focused ? 20 : 22}
          color={focused ? colors.background : colors.textDim}
        />
        {focused ? <Text style={styles.labelFocused}>{label}</Text> : null}
      </View>
      {!focused ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  chip: {
    minHeight: 36,
    minWidth: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 6,
  },
  chipFocused: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  label: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  labelFocused: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '800',
  },
});
