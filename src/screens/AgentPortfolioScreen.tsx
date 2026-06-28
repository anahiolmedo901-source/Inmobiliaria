import React, { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { PropertyCard } from '../components/properties/PropertyCard';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { fetchProperties } from '../services/api';
import type { PropertyAgent, Property } from '../data/types';

export function AgentPortfolioScreen({
  agent,
  onBack,
  onNavigateProperty,
}: {
  agent: PropertyAgent;
  onBack?: () => void;
  onNavigateProperty?: (property: Property) => void;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const padding = isDesktop ? 64 : 20;
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);

  useEffect(() => {
    fetchProperties({ limit: 100 })
      .then((res) => { if (res.data.length) setProperties(res.data); })
      .catch(() => {});
  }, []);

  const agentProperties = useMemo(
    () => properties.filter((p) => p.agent.id === agent.id),
    [properties, agent.id],
  );

  const whatsappNumber = agent.whatsappE164?.replace(/^\+/, '').replace(/[^\d]/g, '');

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, { paddingHorizontal: padding }]}>
        <Breadcrumbs segments={[{ label: 'Agentes', onPress: onBack }, { label: agent.name }]} onBack={onBack} />

        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}>
          <View style={[isDesktop ? styles.profileRow : styles.profileCol]}>
            <View style={styles.avatarSection}>
              <Image source={{ uri: agent.avatarUrl }} style={styles.avatar} resizeMode="cover" />
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={[styles.badgeText, { color: theme.onPrimary }]}>{agent.title.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={[styles.agentName, { color: theme.onSurface }]}>{agent.name}</Text>
              <Text style={[styles.agentRegion, { color: theme.primary }]}>{agent.region}</Text>

              <View style={[styles.statsRow, { borderTopColor: theme.outlineVariant }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Experiencia</Text>
                  <Text style={[styles.statValue, { color: theme.onSurface }]}>{agent.experience}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Especialidad</Text>
                  <Text style={[styles.statValue, { color: theme.onSurface }]}>{agent.specialties}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Idiomas</Text>
                  <Text style={[styles.statValue, { color: theme.onSurface }]}>{agent.languages}</Text>
                </View>
              </View>

              <View style={styles.contactRow}>
                {agent.email ? (
                  <Pressable
                    onPress={() => Linking.openURL(`mailto:${agent.email}`).catch(() => {})}
                    style={({ pressed }) => [styles.contactBtn, { borderColor: theme.outlineVariant }, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="mail" size={16} color={theme.primary} />
                    <Text style={[styles.contactBtnText, { color: theme.onSurface }]}>{agent.email}</Text>
                  </Pressable>
                ) : null}
                {agent.phoneE164 ? (
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${agent.phoneE164}`).catch(() => {})}
                    style={({ pressed }) => [styles.contactBtn, { borderColor: theme.outlineVariant }, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="call" size={16} color={theme.primary} />
                    <Text style={[styles.contactBtnText, { color: theme.onSurface }]}>{agent.phoneE164}</Text>
                  </Pressable>
                ) : null}
                {whatsappNumber ? (
                  <Pressable
                    onPress={() => Linking.openURL(`https://wa.me/${whatsappNumber}`).catch(() => {})}
                    style={({ pressed }) => [styles.contactBtn, { borderColor: theme.outlineVariant }, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color={theme.primary} />
                    <Text style={[styles.contactBtnText, { color: theme.onSurface }]}>WhatsApp</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>
            Portafolio de {agent.name}
          </Text>
          <Text style={[styles.sectionCount, { color: theme.onSurfaceVariant }]}>
            {agentProperties.length} {agentProperties.length === 1 ? 'propiedad' : 'propiedades'}
          </Text>
        </View>

        {agentProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color={theme.onSurfaceVariant} />
            <Text style={[styles.emptyText, { color: theme.onSurfaceVariant }]}>
              Este agente no tiene propiedades asignadas actualmente.
            </Text>
          </View>
        ) : (
          <View style={[styles.grid, { gap: theme.spacing.gutter }]}>
            {agentProperties.map((property) => (
              <View key={property.id} style={[styles.gridItem, isDesktop && { width: '30%' }]}>
                <PropertyCard property={property} onPress={() => onNavigateProperty?.(property)} />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  inner: { paddingVertical: 16, maxWidth: 1280, marginHorizontal: 'auto', width: '100%' },
  profileCard: { borderWidth: 1, borderRadius: 18, padding: 28, marginBottom: 40 },
  profileRow: { flexDirection: 'row', gap: 40 },
  profileCol: { flexDirection: 'column', gap: 24 },
  avatarSection: { alignItems: 'center', gap: 12 },
  avatar: { width: 200, height: 240, borderRadius: 12 },
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  infoSection: { flex: 1, gap: 16, justifyContent: 'center' },
  agentName: { fontSize: 32, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  agentRegion: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 32, borderTopWidth: 1, paddingTop: 16, flexWrap: 'wrap' },
  statItem: { minWidth: 120 },
  statLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700' },
  contactRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  contactBtnText: { fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  sectionTitle: { fontSize: 22, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  sectionCount: { fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 16 },
  emptyText: { fontSize: 14, textAlign: 'center', maxWidth: 320 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 80 },
  gridItem: { flex: 1, minWidth: 280 },
});
