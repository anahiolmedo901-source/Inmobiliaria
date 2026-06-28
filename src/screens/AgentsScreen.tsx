import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MOCK_AGENTS } from '../data/mockAgents';
import { fetchAgents } from '../services/api';
import type { PropertyAgent } from '../data/types';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

const PROFESSIONAL_AVATARS: Record<string, string> = {
  'a-1': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=512&q=80',
  'a-2': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=512&q=80',
  'a-3': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=512&q=80',
  'a-4': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=512&q=80',
  'a-5': 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=512&q=80',
  'a-6': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=512&q=80',
};

const PROFESSIONAL_PHOTO_AGENTS = MOCK_AGENTS.map((agent) => ({
  ...agent,
  avatarUrl: PROFESSIONAL_AVATARS[agent.id] || agent.avatarUrl,
}));

export function AgentsScreen({
  onBack,
  onNavigateAgent,
}: {
  onBack?: () => void;
  onNavigateAgent?: (agent: PropertyAgent) => void;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const padding = isDesktop ? 64 : 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<PropertyAgent[]>(PROFESSIONAL_PHOTO_AGENTS);

  useEffect(() => {
    fetchAgents()
      .then((data) => { if (data.length) setAgents(data); })
      .catch(() => {});
  }, []);

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const q = searchQuery.trim().toLowerCase();
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.region?.toLowerCase().includes(q) ||
        a.specialties?.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q)
    );
  }, [searchQuery, agents]);

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, { paddingHorizontal: padding }]}>
        <Breadcrumbs segments={[{ label: 'Agentes' }]} onBack={onBack} />

        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: theme.primary }]}>Directorio de Asesores</Text>
          <Text style={[styles.heroDesc, { color: theme.onSurfaceVariant }]}>
            Conecta con los profesionales inmobiliarios más distinguidos de México. Nuestros asesores
            se especializan en la adquisición y venta de propiedades excepcionales para clientes privados
            e inversionistas institucionales.
          </Text>
        </View>

        <View style={[styles.filterBar, { borderColor: theme.outlineVariant, backgroundColor: theme.surface }]}>
          <View style={styles.filterField}>
            <Ionicons name="search" size={20} color={theme.outline} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por nombre, región o especialidad..."
              placeholderTextColor={theme.onSurfaceVariant}
              style={[styles.filterInput, { color: theme.onSurface }]}
            />
          </View>
          {searchQuery.trim() ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <Ionicons name="close-circle" size={22} color={theme.onSurfaceVariant} />
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.grid, { gap: theme.spacing.gutter }]}>
          {filteredAgents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.onSurfaceVariant} />
              <Text style={[styles.emptyTitle, { color: theme.onSurface }]}>Sin resultados</Text>
              <Text style={[styles.emptyDesc, { color: theme.onSurfaceVariant }]}>
                No se encontraron agentes con "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredAgents.map((agent) => (
              <View
                key={agent.id}
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}
              >
                <View style={styles.cardImageWrap}>
                  <Image source={{ uri: agent.avatarUrl }} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBadge}>
                    <Text style={[styles.cardBadgeText, { backgroundColor: theme.primary, color: theme.onPrimary }]}>
                      {agent.title.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={[styles.agentName, { color: theme.onSurface }]}>{agent.name}</Text>
                  <Text style={[styles.agentRegion, { color: theme.primary }]}>{agent.region}</Text>

                  <View style={[styles.agentStats, { borderTopColor: theme.outlineVariant }]}>
                    <View style={styles.statRow}>
                      <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>EXPERIENCIA</Text>
                      <Text style={[styles.statValue, { color: theme.onSurface }]}>{agent.experience}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>ESPECIALIDAD</Text>
                      <Text style={[styles.statValue, { color: theme.onSurface }]}>{agent.specialties}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>IDIOMAS</Text>
                      <Text style={[styles.statValue, { color: theme.onSurface }]}>{agent.languages}</Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => onNavigateAgent?.(agent)}
                    style={({ pressed }) => [
                      styles.portfolioBtn,
                      { borderColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={[styles.portfolioBtnText, { color: theme.primary }]}>Ver Portafolio</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  inner: { paddingVertical: 16, maxWidth: 1280, marginHorizontal: 'auto', width: '100%' },
  hero: { marginBottom: 48, maxWidth: 600 },
  heroTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text', marginBottom: 16 },
  heroDesc: { fontSize: 16, lineHeight: 26 },
  filterBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 12, marginBottom: 48, gap: 12 },
  filterField: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  filterInput: { flex: 1, fontSize: 15, fontWeight: '500', paddingVertical: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 80 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 16, width: '100%' },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', maxWidth: 320 },
  card: { width: '22%', minWidth: 260, flex: 1, borderWidth: 1, overflow: 'hidden' },
  cardImageWrap: { aspectRatio: 4 / 5, overflow: 'hidden', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 12, left: 12 },
  cardBadgeText: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 10, fontWeight: '700', letterSpacing: 1, borderRadius: 4, overflow: 'hidden' },
  cardInfo: { padding: 20, gap: 8 },
  agentName: { fontSize: 20, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  agentRegion: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  agentStats: { borderTopWidth: 1, paddingTop: 12, gap: 8, marginVertical: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  statValue: { fontSize: 14, fontWeight: '600' },
  portfolioBtn: { borderWidth: 1.5, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  portfolioBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
});
