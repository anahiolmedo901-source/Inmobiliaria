import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import type { Property } from '../../data/types';

const FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function PropertyCard({
  property,
  onPress,
}: {
  property: Property;
  onPress?: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.outlineVariant },
        pressed && { opacity: 0.95 },
      ]}
    >
      <View style={[styles.imageShell, { backgroundColor: theme.surfaceContainerHigh }]}>
        <Image source={{ uri: property.images[0] }} style={styles.image} resizeMode="cover" />
        <View style={styles.badges}>
          {property.featured ? (
            <Text style={[styles.badge, { backgroundColor: theme.primary, color: theme.onPrimary }]}>
              DESTACADA
            </Text>
          ) : null}
          <Text
            style={[styles.badge, { backgroundColor: theme.surfaceContainerHighest + 'dd', color: theme.onSurface }]}
          >
            {property.operation === 'sale' ? 'VENTA' : 'RENTA'}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.onSurface }]} numberOfLines={1}>
            {property.title}
          </Text>
          <Text style={[styles.price, { color: theme.primary }]}>{FORMATTER.format(property.price)} MXN</Text>
        </View>

        <Text style={[styles.location, { color: theme.onSurfaceVariant }]} numberOfLines={1}>
          {property.location.label}
        </Text>

        <View style={[styles.features, { borderTopColor: theme.outlineVariant }]}>
          <View style={styles.featureItem}>
            <Ionicons name="bed" size={16} color={theme.onSurfaceVariant} />
            <Text style={[styles.featureText, { color: theme.onSurfaceVariant }]}>
              {property.features.bedrooms} Rec
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="water" size={16} color={theme.onSurfaceVariant} />
            <Text style={[styles.featureText, { color: theme.onSurfaceVariant }]}>
              {property.features.bathrooms} Baños
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="resize" size={16} color={theme.onSurfaceVariant} />
            <Text style={[styles.featureText, { color: theme.onSurfaceVariant }]}>
              {property.features.builtAreaM2.toLocaleString()} m²
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  imageShell: { aspectRatio: 4 / 5, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  badges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 10, fontWeight: '700', letterSpacing: 1, borderRadius: 4, overflow: 'hidden' },
  info: { padding: 16, gap: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: '700', flex: 1, marginRight: 8 },
  price: { fontSize: 14, fontWeight: '700' },
  location: { fontSize: 14, marginBottom: 8 },
  features: { flexDirection: 'row', gap: 16, borderTopWidth: 1, paddingTop: 10, marginTop: 4 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featureText: { fontSize: 12, fontWeight: '600' },
});
