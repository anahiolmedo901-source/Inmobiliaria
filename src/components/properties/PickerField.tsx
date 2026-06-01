import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';

type PickerOption = {
  label: string;
  value: string;
};

export function PickerField({
  selectedValue,
  onValueChange,
  options,
  style,
}: {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  style?: any;
}) {
  const { theme } = useAppTheme();
  const [open, setOpen] = React.useState(false);

  const selected = options.find((o) => o.value === selectedValue);

  if (Platform.OS === 'web') {
    return (
      <select
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 14,
          fontWeight: '600',
          border: `1px solid ${theme.outlineVariant}`,
          borderRadius: 12,
          backgroundColor: 'transparent',
          color: theme.onSurface,
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <View style={style}>
      <Pressable
        onPress={() => setOpen(!open)}
        style={({ pressed }) => [
          styles.nativeTrigger,
          { borderColor: theme.outlineVariant, backgroundColor: 'transparent' },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={[styles.nativeTriggerText, { color: theme.onSurface }]}>
          {selected?.label ?? selectedValue}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={theme.onSurfaceVariant} />
      </Pressable>

      {open ? (
        <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {options.map((opt) => {
              const active = opt.value === selectedValue;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    { backgroundColor: active ? theme.primaryContainer + '30' : 'transparent' },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: active ? theme.primary : theme.onSurface },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  nativeTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  nativeTriggerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 100,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
