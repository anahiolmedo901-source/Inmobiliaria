import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import type { BreadcrumbSegment } from '../../data/types';

export { type BreadcrumbSegment };

export function Breadcrumbs({
  segments,
  onBack,
  backLabel = 'Volver',
}: {
  segments: BreadcrumbSegment[];
  onBack?: () => void;
  backLabel?: string;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.85 }, { backgroundColor: theme.surfaceContainerHighest }]}
          >
            <Ionicons name="arrow-back" size={18} color={theme.primary} />
            <Text style={[styles.backLabel, { color: theme.primary }]}>{backLabel}</Text>
          </Pressable>
        ) : (
          <View />
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {segments.map((seg, idx) => {
            const isLast = idx === segments.length - 1;
            const key = `${seg.label}-${idx}`;

            return (
              <View style={styles.crumbRow} key={key}>
                {idx > 0 ? (
                  <Text style={[styles.sep, { color: theme.onSurfaceVariant }]}>{'>'}</Text>
                ) : null}

                {seg.onPress && !isLast ? (
                  <Pressable onPress={seg.onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
                    <Text style={[styles.crumb, { color: theme.primary }]}>{seg.label}</Text>
                  </Pressable>
                ) : (
                  <Text
                    style={[
                      styles.crumb,
                      { color: isLast ? theme.onSurface : theme.onSurfaceVariant },
                    ]}
                    numberOfLines={1}
                  >
                    {seg.label}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
  },
  crumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sep: {
    fontSize: 12,
    fontWeight: '600',
  },
  crumb: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 220,
  },
});
