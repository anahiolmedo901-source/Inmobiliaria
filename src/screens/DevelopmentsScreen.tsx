import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MOCK_DEVELOPMENTS, DEVELOPMENT_STATUS_MAP } from '../data/mockDevelopments';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import type { Property } from '../data/types';

export function DevelopmentsScreen({
  onBack,
  onNavigateProperty,
}: {
  onBack?: () => void;
  onNavigateProperty?: (property: Property) => void;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const padding = isDesktop ? 64 : 20;

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, { paddingHorizontal: padding }]}>
        <Breadcrumbs segments={[{ label: 'Desarrollos' }]} onBack={onBack} />

        <View style={styles.hero}>
          <Text style={[styles.heroLabel, { color: theme.primary }]}>DESARROLLO DESTACADO</Text>
          <Text style={[styles.heroTitle, { color: theme.primary }]}>Reserva Obsidiana</Text>
          <Text style={[styles.heroDesc, { color: theme.onSurfaceVariant }]}>
            Una obra maestra arquitectónica esculpida en los acantilados de basalto de la costa nayarita.
            Experimenta un estilo de vida definido por la belleza natural del Pacífico y el lujo interior
            sin concesiones.
          </Text>

          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.onSurfaceVariant }]}>PROGRESO DE CONSTRUCCIÓN</Text>
              <Text style={[styles.progressValue, { color: theme.primary }]}>74%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.surfaceContainerHighest }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.primaryContainer, width: '74%' }]} />
            </View>
            <Text style={[styles.progressDate, { color: theme.outline }]}>Finalización estimada: Q4 2025</Text>
          </View>

          {/*<View style={styles.heroActions}>
            <Pressable
              onPress={() => onNavigateProperty?.({
                id: 'p-6',
                title: 'Villa Marbella',
                subtitle: 'Unidad disponible',
                images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'],
                location: { label: 'Costa de Nayarit, México', addressLine: 'Reserva Obsidiana', lat: 20.7682, lng: -105.5437 },
                description: 'Unidad de lujo dentro del desarrollo Reserva Obsidiana. Acabados premium.',
                features: { bedrooms: 4, bathrooms: 5, builtAreaM2: 540, landAreaM2: 900, floors: 2, parkingSpaces: 3 },
                price: 4200000,
                status: 'pre_construction',
                type: 'villa',
                operation: 'sale',
                featured: false,
                createdAt: '2025-01-15',
                agent: {
                  id: 'a-2',
                  name: 'Camila Reyes',
                  title: 'Directora de Propiedades Premium',
                  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
                  phoneE164: '+526241234567',
                  email: 'camila@viviana.mx',
                  whatsappE164: '+526241234567',
                },
              })}
              style={({ pressed }) => [styles.heroBtnOutline, { borderColor: theme.primary, opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={[styles.heroBtnOutlineText, { color: theme.primary }]}>VER UNIDADES</Text>
            </Pressable>
          </View>*/}
        </View>

        <View style={styles.heroImage}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80' }}
            style={styles.heroImg}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.filterBar, { borderBottomColor: theme.outlineVariant }]}>
          <View>
            <Text style={[styles.filterTitle, { color: theme.onSurface }]}>Portafolio Nacional</Text>
            <Text style={[styles.filterSubtitle, { color: theme.onSurfaceVariant }]}>
              Explora nuestros desarrollos arquitectónicos curados en los destinos más exclusivos de México.
            </Text>
          </View>
        </View>

        <View style={[styles.grid, { gap: theme.spacing.gutter }]}>
          {MOCK_DEVELOPMENTS.map((dev) => (
            <Pressable
              key={dev.id}
              onPress={() => onNavigateProperty?.({
                id: `dev-${dev.id}`,
                title: dev.title,
                images: dev.images,
                location: { label: dev.location, lat: 20.6534, lng: -105.2253 },
                description: dev.description,
                features: { bedrooms: 4, bathrooms: 5, builtAreaM2: 500, landAreaM2: 800, floors: 2, parkingSpaces: 3 },
                price: parseInt(dev.priceRange.replace(/[^0-9]/g, '').slice(0, 6)) * 1000 || 5000000,
                status: 'pre_construction',
                type: 'villa',
                operation: 'sale',
                featured: dev.status === 'pre_launch',
                createdAt: '2025-01-01',
                agent: {
                  id: 'a-4',
                  name: 'Diego Montenegro',
                  title: 'Especialista en Inversiones',
                  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
                  phoneE164: '+528181234567',
                  email: 'diego@viviana.mx',
                  whatsappE164: '+528181234567',
                },
              })}
            >
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}>
                <View style={[styles.cardImage, { backgroundColor: theme.surfaceContainerHigh }]}>
                  <Image source={{ uri: dev.images[0] }} style={styles.cardImg} resizeMode="cover" />
                  <View style={styles.cardBadges}>
                    <Text style={[styles.cardBadge, { backgroundColor: theme.surface + 'e6', color: theme.onSurface }]}>
                      {dev.category}
                    </Text>
                    {dev.status === 'pre_launch' ? (
                      <Text style={[styles.cardBadge, { backgroundColor: theme.primary, color: theme.onPrimary }]}>
                        NUEVO
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, { color: theme.onSurface }]}>{dev.title}</Text>
                    <Text style={[styles.cardPrice, { color: theme.primary }]}>{dev.priceRange}</Text>
                  </View>
                  <Text style={[styles.cardLocation, { color: theme.onSurfaceVariant }]}>
                    {dev.location} • {dev.unitsTotal} Unidades de Lujo
                  </Text>
                  <View style={[styles.cardStats, { borderTopColor: theme.outlineVariant }]}>
                    <View>
                      <Text style={[styles.statLabel, { color: theme.outline }]}>UNIDADES DISPONIBLES</Text>
                      <Text style={[styles.statValue, { color: theme.onSurface }]}>{dev.unitsLeft}</Text>
                    </View>
                    <View>
                      <Text style={[styles.statLabel, { color: theme.outline }]}>ESTADO</Text>
                      <Text style={[styles.statValue, { color: theme.onSurface }]}>
                        {DEVELOPMENT_STATUS_MAP[dev.status]}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  inner: { paddingVertical: 16, maxWidth: 1280, marginHorizontal: 'auto', width: '100%' },
  hero: { marginBottom: 40, maxWidth: 500 },
  heroLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  heroTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text', lineHeight: 48, marginBottom: 16 },
  heroDesc: { fontSize: 16, lineHeight: 26, marginBottom: 24 },
  progressSection: { gap: 8, marginBottom: 28 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  progressLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  progressValue: { fontSize: 20, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressDate: { fontSize: 13, fontStyle: 'italic' },
  heroActions: { flexDirection: 'row', gap: 16 },
  heroBtn: { paddingHorizontal: 28, paddingVertical: 16 },
  heroBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  heroBtnOutline: { borderWidth: 1.5, paddingHorizontal: 28, paddingVertical: 16 },
  heroBtnOutlineText: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  heroImage: { height: 500, marginBottom: 80, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  filterBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 24, marginBottom: 48 },
  filterTitle: { fontSize: 28, fontWeight: '400', fontFamily: 'Libre Caslon Text', marginBottom: 4 },
  filterSubtitle: { fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { width: '45%', minWidth: 320, flex: 1, borderWidth: 1, marginBottom: 48, overflow: 'hidden' },
  cardImage: { aspectRatio: 4 / 5, overflow: 'hidden', position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  cardBadges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  cardBadge: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 10, fontWeight: '700', letterSpacing: 1, borderRadius: 4, overflow: 'hidden' },
  cardInfo: { padding: 28, gap: 12 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 22, fontWeight: '700', fontFamily: 'Libre Caslon Text', flex: 1, lineHeight: 28 },
  cardPrice: { fontSize: 16, fontWeight: '700' },
  cardLocation: { fontSize: 15, marginBottom: 10, lineHeight: 22 },
  cardStats: { flexDirection: 'row', gap: 40, borderTopWidth: 1, paddingTop: 16 },
  statLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  statValue: { fontSize: 16, fontWeight: '700' },
});
