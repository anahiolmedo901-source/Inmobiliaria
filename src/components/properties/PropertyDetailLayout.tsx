import React, { useMemo, useState } from 'react';
import {
  Linking,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Breadcrumbs, type BreadcrumbSegment } from '../navigation/Breadcrumbs';
import { useAppTheme } from '../../theme/ThemeContext';
import { MapContainer } from '../maps/MapContainer';

export type PropertyAgent = {
  name: string;
  title?: string;
  avatarUrl?: string;
  phoneE164?: string;
  email?: string;
  whatsappE164?: string;
};

export type PropertyLocation = {
  label: string;
  addressLine?: string;
  lat: number;
  lng: number;
};

export type PropertyFeatures = {
  bedrooms?: number;
  bathrooms?: number;
  builtAreaM2?: number;
  landAreaM2?: number;
  floors?: number;
  parkingSpaces?: number;
};

export type PropertyDetailModel = {
  id: string;
  title: string;
  images: string[];
  location: PropertyLocation;
  description: string;
  features: PropertyFeatures;
  agent?: PropertyAgent;
  breadcrumbs: BreadcrumbSegment[];
};

function normalizePhoneForWhatsApp(whatsappE164?: string) {
  if (!whatsappE164) return undefined;
  return whatsappE164.replace(/^\+/, '').replace(/[^\d]/g, '');
}

function formatTel(phoneE164?: string) {
  if (!phoneE164) return undefined;
  return `tel:${phoneE164.replace(/\s+/g, '')}`;
}

export function PropertyDetailLayout({
  property,
  onBack,
}: {
  property: PropertyDetailModel;
  onBack?: () => void;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [carouselIndex, setCarouselIndex] = useState(0);

  const breadcrumbSegments = useMemo(() => property.breadcrumbs, [property.breadcrumbs]);

  const contact = property.agent;
  const whatsappNumber = normalizePhoneForWhatsApp(contact?.whatsappE164);

  const technicalPairs = useMemo(() => {
    const f = property.features;
    return [
      { label: 'Cuartos', value: f.bedrooms != null ? String(f.bedrooms) : '-' },
      { label: 'Baños', value: f.bathrooms != null ? String(f.bathrooms) : '-' },
      { label: 'Construcción', value: f.builtAreaM2 != null ? `${f.builtAreaM2} m2` : '-' },
      { label: 'Terreno', value: f.landAreaM2 != null ? `${f.landAreaM2} m2` : '-' },
      { label: 'Pisos', value: f.floors != null ? String(f.floors) : '-' },
      { label: 'Autos', value: f.parkingSpaces != null ? String(f.parkingSpaces) : '-' },
    ];
  }, [property.features]);

  const primaryMapStyles = useMemo(() => {
    return isDesktop ? { height: 380 } : { height: 300 };
  }, [isDesktop]);

  function handleBack() { onBack?.(); }

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.pageInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: isDesktop ? 64 : 16, maxWidth: theme.spacing.containerMax, marginHorizontal: 'auto', width: '100%' }}>
        <Breadcrumbs segments={breadcrumbSegments} onBack={handleBack} backLabel="Volver" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.outlineVariant,
              shadowColor: theme.inverseSurface + '20',
            },
          ]}
        >
          <View style={isDesktop ? styles.detailGridDesktop : styles.detailGridMobile}>
            {/* Left: Carousel + Description */}
            <View style={styles.leftCol}>
              <View style={[styles.carouselShell, { borderColor: theme.outlineVariant }]}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => {
                    const next = Math.round(
                      e.nativeEvent.contentOffset.x / Math.max(1, e.nativeEvent.layoutMeasurement.width)
                    );
                    setCarouselIndex(next);
                  }}
                >
                  {(property.images.length ? property.images : [undefined]).map((img, idx) => (
                    <View key={`${img ?? 'placeholder'}-${idx}`} style={{ width: '100%' }}>
                      {img ? (
                        <Image source={{ uri: img }} style={styles.carouselImage} resizeMode="cover" />
                      ) : (
                        <View style={[styles.carouselImage, { backgroundColor: theme.surfaceContainerHighest }]} />
                      )}
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.carouselDots} pointerEvents="none">
                  {property.images.slice(0, 6).map((_, dotIdx) => {
                    const active = dotIdx === carouselIndex;
                    return (
                      <View
                        key={dotIdx}
                        style={[
                          styles.dot,
                          { backgroundColor: active ? theme.primary : theme.outlineVariant },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.title, { color: theme.onSurface }]}>{property.title}</Text>
                <Text style={[styles.locationText, { color: theme.onSurfaceVariant }]}>{property.location.label}</Text>
                <Text style={[styles.desc, { color: theme.onSurface }]}>{property.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>Información técnica</Text>
                <View style={styles.techGrid}>
                  {technicalPairs.map((pair) => (
                    <View key={pair.label} style={[styles.techItem, { borderColor: theme.outlineVariant }]}>
                      <Text style={[styles.techLabel, { color: theme.onSurfaceVariant }]}>{pair.label}</Text>
                      <Text style={[styles.techValue, { color: theme.onSurface }]}>{pair.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Right: Agent + Map */}
            <View style={styles.rightCol}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>Agente asignado</Text>

                {contact ? (
                  <View style={[styles.agentCard, { borderColor: theme.outlineVariant, backgroundColor: theme.surface }]}>
                    <View style={styles.agentTop}>
                      {contact.avatarUrl ? (
                        <Image source={{ uri: contact.avatarUrl }} style={styles.agentAvatar} />
                      ) : (
                        <View style={[styles.agentAvatar, { backgroundColor: theme.surfaceContainerHighest }]} />
                      )}

                      <View style={{ flex: 1 }}>
                        <Text style={[styles.agentName, { color: theme.onSurface }]}>{contact.name}</Text>
                        {contact.title ? (
                          <Text style={[styles.agentTitle, { color: theme.onSurfaceVariant }]}>{contact.title}</Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.agentActions}>
                      <Pressable
                        disabled={!whatsappNumber}
                        onPress={() => {
                          if (!whatsappNumber) return;
                          Linking.openURL(`https://wa.me/${whatsappNumber}`).catch(() => undefined);
                        }}
                        style={({ pressed }) => [
                          styles.agentBtn,
                          { borderColor: theme.outlineVariant, backgroundColor: theme.surface },
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Ionicons name="logo-whatsapp" size={16} color={theme.primary} />
                        <Text style={[styles.agentBtnText, { color: theme.onSurface }]}>WhatsApp</Text>
                      </Pressable>

                      <Pressable
                        disabled={!contact.email}
                        onPress={() => {
                          if (!contact.email) return;
                          Linking.openURL(`mailto:${contact.email}`).catch(() => undefined);
                        }}
                        style={({ pressed }) => [
                          styles.agentBtn,
                          { borderColor: theme.outlineVariant, backgroundColor: theme.surface },
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Ionicons name="mail" size={16} color={theme.primary} />
                        <Text style={[styles.agentBtnText, { color: theme.onSurface }]}>Correo</Text>
                      </Pressable>

                      <Pressable
                        disabled={!contact.phoneE164}
                        onPress={() => {
                          const url = formatTel(contact.phoneE164);
                          if (!url) return;
                          Linking.openURL(url).catch(() => undefined);
                        }}
                        style={({ pressed }) => [
                          styles.agentBtn,
                          { borderColor: theme.outlineVariant, backgroundColor: theme.surface },
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Ionicons name="call" size={16} color={theme.primary} />
                        <Text style={[styles.agentBtnText, { color: theme.onSurface }]}>Llamar</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.agentCard, { borderColor: theme.outlineVariant }]}>
                    <Text style={{ color: theme.onSurfaceVariant }}>Sin agente asignado.</Text>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>Mapa</Text>

                <View
                  style={[
                    styles.mapShell,
                    { borderColor: theme.outlineVariant, backgroundColor: theme.surfaceContainerHighest },
                    primaryMapStyles,
                  ]}
                >
                  <MapContainer
                    latitude={property.location.lat}
                    longitude={property.location.lng}
                    style={styles.mapView}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageInner: { paddingVertical: 10 },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  detailGridDesktop: { flexDirection: 'row', gap: 16 },
  detailGridMobile: { flexDirection: 'column', gap: 16 },
  leftCol: { flex: 1.4 },
  rightCol: { flex: 0.9 },
  carouselShell: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  carouselImage: { width: '100%', height: 320, backgroundColor: '#ddd' },
  carouselDots: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    flexDirection: 'row',
    gap: 8,
  },
  dot: { width: 10, height: 6, borderRadius: 999 },
  section: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  locationText: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  desc: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '900', marginBottom: 10 },
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  techItem: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  techLabel: { fontSize: 12, fontWeight: '800', marginBottom: 8 },
  techValue: { fontSize: 16, fontWeight: '900' },
  agentCard: { borderWidth: 1, borderRadius: 16, padding: 12, gap: 12 },
  agentTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  agentAvatar: { width: 56, height: 56, borderRadius: 999, backgroundColor: '#ccc' },
  agentName: { fontSize: 15, fontWeight: '900' },
  agentTitle: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  agentActions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  agentBtn: {
    flexBasis: 100,
    flexGrow: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  agentBtnText: { fontWeight: '900', fontSize: 12 },
  mapShell: { borderWidth: 1, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  mapView: { ...StyleSheet.absoluteFill },
});
