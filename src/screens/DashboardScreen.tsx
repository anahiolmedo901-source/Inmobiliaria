import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { fetchProperties } from '../services/api';
import type { Property } from '../data/types';
import type { AuthRole } from '../theme/ThemeContext';

const FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function DashboardScreen({
  userName,
  role,
  userAvatar,
  onLogout,
  onNavigateProperty,
  onNavigateHome,
}: {
  userName?: string | null;
  role: AuthRole;
  userAvatar?: string;
  onLogout?: () => void;
  onNavigateProperty?: (property: Property) => void;
  onNavigateHome?: () => void;
}) {
  const { theme, mode } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const padding = isDesktop ? 64 : 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allProperties, setAllProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const pageSize = 5;

  useEffect(() => {
    fetchProperties({ limit: 100 })
      .then((res) => { if (res.data.length) setAllProperties(res.data); })
      .catch(() => {});
  }, []);

  const filtered = allProperties.filter((p) =>
    searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.label.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalValue = allProperties.reduce((sum, p) => sum + p.price, 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sidebarItems = [
    { icon: 'grid' as const, label: 'Panel', active: true, onPress: () => {} },
    { icon: 'business' as const, label: 'Propiedades', active: false, onPress: () => {} },
    { icon: 'analytics' as const, label: 'Estadísticas', active: false, onPress: () => {} },
    { icon: 'people' as const, label: 'Agentes', active: false, onPress: () => {} },
    { icon: 'settings' as const, label: 'Ajustes', active: false, onPress: () => {} },
  ];

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      {isDesktop ? (
        <View style={[styles.sidebar, { backgroundColor: theme.surfaceContainer, borderRightColor: theme.outlineVariant }]}>
          <View style={styles.sidebarBrand}>
            <View style={[styles.sidebarIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="business" size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.sidebarTitle, { color: theme.primary }]}>VIVIANA Pro</Text>
              <Text style={[styles.sidebarSub, { color: theme.onSurfaceVariant }]}>Gestión Elite</Text>
            </View>
          </View>

          <View style={styles.sidebarNav}>
            {sidebarItems.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.sidebarItem,
                  {
                    backgroundColor: item.active ? theme.primaryContainer + '40' : 'transparent',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.active ? theme.onPrimaryContainer : theme.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.sidebarItemLabel,
                    { color: item.active ? theme.onPrimaryContainer : theme.onSurfaceVariant },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Ionicons name="add-circle" size={20} color={theme.onPrimary} />
            <Text style={[styles.addBtnText, { color: theme.onPrimary }]}>Agregar Propiedad</Text>
          </Pressable>

          <View style={[styles.sidebarFooter, { borderTopColor: theme.outlineVariant + '40' }]}>
            <View style={styles.profileRow}>
              <Image
                source={{ uri: userAvatar ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80' }}
                style={[styles.profileAvatar] as any}
              />
              <View>
                <Text style={[styles.profileName, { color: theme.onSurface }]}>{userName ?? 'Usuario'}</Text>
                <Text style={[styles.profileRole, { color: theme.onSurfaceVariant }]}>
                  {role === 'admin' ? 'Administrador' : 'Agente Principal'}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => {}} style={styles.sidebarLink}>
              <Ionicons name="help-circle" size={18} color={theme.onSurfaceVariant} />
              <Text style={[styles.sidebarLinkText, { color: theme.onSurfaceVariant }]}>Ayuda</Text>
            </Pressable>
            <Pressable onPress={onLogout} style={styles.sidebarLink}>
              <Ionicons name="log-out" size={18} color={theme.onSurfaceVariant} />
              <Text style={[styles.sidebarLinkText, { color: theme.onSurfaceVariant }]}>Cerrar Sesión</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={[styles.main, isDesktop && { marginLeft: 260 }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: padding, paddingVertical: 40 }}>
          {!isDesktop ? (
            <View style={[styles.mobileNav, { borderBottomColor: theme.outlineVariant }]}>
              <Pressable onPress={onNavigateHome} style={styles.mobileBackBtn}>
                <Ionicons name="arrow-back" size={24} color={theme.onSurface} />
              </Pressable>
              <Text style={[styles.mobileTitle, { color: theme.primary }]}>VIVIANA Pro</Text>
              <Pressable onPress={onLogout} style={styles.mobileLogout}>
                <Ionicons name="log-out" size={22} color={theme.onSurfaceVariant} />
              </Pressable>
            </View>
          ) : null}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.headerLabel, { color: theme.primary }]}>PANEL DE CONTROL</Text>
              <Text style={[styles.headerTitle, { color: theme.onSurface }]}>
                Bienvenido, {userName?.split(' ')[0] ?? 'Usuario'}
              </Text>
            </View>
            <View style={[styles.dateBadge, { backgroundColor: theme.surfaceContainer, borderColor: theme.outlineVariant }]}>
              <Ionicons name="calendar" size={16} color={theme.primary} />
              <Text style={[styles.dateText, { color: theme.onSurface }]}>{dateStr}</Text>
            </View>
          </View>

          <View style={[styles.metricsRow, { gap: theme.spacing.gutter }]}>
            <View style={[styles.metricCard, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.outlineVariant }]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, { backgroundColor: theme.secondaryContainer + '40' }]}>
                  <Ionicons name="business" size={24} color={theme.secondary} />
                </View>
                <Text style={[styles.metricChange, { color: theme.primary }]}>+2 esta semana</Text>
              </View>
              <Text style={[styles.metricLabel, { color: theme.onSurfaceVariant }]}>PROPIEDADES ACTIVAS</Text>
              <Text style={[styles.metricValue, { color: theme.onSurface }]}>{allProperties.length}</Text>
              <View style={[styles.metricBar, { backgroundColor: theme.surfaceContainerHigh }]}>
                <View style={[styles.metricBarFill, { backgroundColor: theme.primary, width: '75%' }]} />
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.outlineVariant }]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, { backgroundColor: theme.primaryContainer + '30' }]}>
                  <Ionicons name="people" size={24} color={theme.primary} />
                </View>
                <Text style={[styles.metricChange, { color: theme.primary }]}>84% tasa de respuesta</Text>
              </View>
              <Text style={[styles.metricLabel, { color: theme.onSurfaceVariant }]}>CLIENTES POTENCIALES</Text>
              <Text style={[styles.metricValue, { color: theme.onSurface }]}>112</Text>
              <View style={styles.metricDots}>
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.surfaceContainerHigh }]} />
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.outlineVariant }]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, { backgroundColor: theme.surfaceContainer }]}>
                  <Ionicons name="wallet" size={24} color={theme.onSurface} />
                </View>
                <View style={styles.metricTrend}>
                  <Ionicons name="trending-up" size={16} color={theme.error} />
                  <Text style={{ color: theme.error, fontSize: 12, fontWeight: '700' }}>12%</Text>
                </View>
              </View>
              <Text style={[styles.metricLabel, { color: theme.onSurfaceVariant }]}>VALOR DEL PORTAFOLIO</Text>
              <Text style={[styles.metricValue, { color: theme.onSurface }]}>{FORMATTER.format(totalValue)} MXN</Text>
              <Text style={[styles.metricCommission, { color: theme.onSurfaceVariant }]}>
                Comisión estimada: {FORMATTER.format(totalValue * 0.03)} MXN
              </Text>
            </View>
          </View>

          {/* My Properties */}
          <View style={{ marginTop: 80 }}>
            <View style={styles.propertiesHeader}>
              <Text style={[styles.propertiesTitle, { color: theme.onSurface }]}>Mis Propiedades</Text>
              <View style={styles.propertiesActions}>
                <View style={[styles.searchField, { borderColor: theme.outlineVariant, backgroundColor: theme.surfaceContainerLowest }]}>
                  <Ionicons name="search" size={18} color={theme.onSurfaceVariant} />
                  <TextInput
                    placeholder="Buscar por nombre o ubicación..."
                    placeholderTextColor={theme.onSurfaceVariant}
                    style={[styles.searchInput, { color: theme.onSurface }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <Pressable onPress={() => {}} style={[styles.filterIcon, { backgroundColor: theme.surfaceContainer, borderColor: theme.outlineVariant }]}>
                  <Ionicons name="filter" size={18} color={theme.onSurfaceVariant} />
                </Pressable>
              </View>
            </View>

            <View style={[styles.table, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.outlineVariant }]}>
              <View style={[styles.tableHeader, { borderBottomColor: theme.outlineVariant + '40' }]}>
                <Text style={[styles.tableHeaderCell, { color: theme.onSurfaceVariant }]}>Propiedad</Text>
                <Text style={[styles.tableHeaderCell, { color: theme.onSurfaceVariant }]}>Estado</Text>
                <Text style={[styles.tableHeaderCell, { color: theme.onSurfaceVariant }]}>Precio</Text>
                <Text style={[styles.tableHeaderCell, { color: theme.onSurfaceVariant }]}>Consultas</Text>
                <View style={{ width: 40 }} />
              </View>

              {paginated.map((property) => (
                <Pressable
                  key={property.id}
                  onPress={() => onNavigateProperty?.(property)}
                  style={({ pressed }) => [
                    styles.tableRow,
                    { borderBottomColor: theme.outlineVariant + '20', opacity: pressed ? 0.95 : 1 },
                  ]}
                >
                  <View style={styles.propertyCell}>
                    <Image source={{ uri: property.images[0] }} style={[styles.propertyThumb] as any} />
                    <View>
                      <Text style={[styles.propertyName, { color: theme.onSurface }]}>{property.title}</Text>
                      <Text style={[styles.propertyLocation, { color: theme.onSurfaceVariant }]}>
                        {property.location.label}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statusCell}>
                    <Text
                      style={[styles.statusBadge, { backgroundColor: theme.primary + '20', color: theme.primary }]}
                    >
                      {property.status === 'active' ? 'Activa' : 'En Negociación'}
                    </Text>
                  </View>
                  <Text style={[styles.priceCell, { color: theme.onSurface }]}>
                    {FORMATTER.format(property.price)} MXN
                  </Text>
                  <View style={styles.inquiriesCell}>
                    <View style={[styles.avatar, { backgroundColor: theme.surfaceContainerHigh }]}>
                      <Text style={styles.avatarText}>+{property.id.charCodeAt(2) % 12 + 2}</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => {}} style={styles.moreBtn}>
                    <Ionicons name="ellipsis-vertical" size={18} color={theme.onSurfaceVariant} />
                  </Pressable>
                </Pressable>
              ))}
            </View>

            <View style={styles.pagination}>
              <Text style={[styles.paginationInfo, { color: theme.onSurfaceVariant }]}>
                Mostrando {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} de {filtered.length} propiedades
              </Text>
              <View style={styles.paginationBtns}>
                <Pressable
                  onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  style={[styles.pageBtn, { borderColor: theme.outlineVariant }]}
                >
                  <Ionicons name="chevron-back" size={18} color={theme.onSurfaceVariant} />
                </Pressable>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Pressable
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    style={page === currentPage
                      ? [styles.pageBtnActive, { backgroundColor: theme.primary }]
                      : [styles.pageBtn, { borderColor: theme.outlineVariant }]}
                  >
                    <Text
                      style={[
                        styles.pageBtnText,
                        { color: page === currentPage ? theme.onPrimary : theme.onSurface },
                      ]}
                    >
                      {page}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  style={[styles.pageBtn, { borderColor: theme.outlineVariant }]}
                >
                  <Ionicons name="chevron-forward" size={18} color={theme.onSurfaceVariant} />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 260, borderRightWidth: 1, padding: 24, gap: 32 },
  sidebarBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sidebarIcon: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sidebarTitle: { fontSize: 20, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  sidebarSub: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  sidebarNav: { flex: 1, gap: 4 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10 },
  sidebarItemLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 10 },
  addBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  sidebarFooter: { borderTopWidth: 1, paddingTop: 24, gap: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileAvatar: { width: 40, height: 40, borderRadius: 20 },
  profileName: { fontSize: 14, fontWeight: '700' },
  profileRole: { fontSize: 12 },
  sidebarLink: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8, paddingHorizontal: 8 },
  sidebarLinkText: { fontSize: 13, fontWeight: '600' },
  main: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
  headerLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  headerTitle: { fontSize: 36, fontWeight: '400', fontFamily: 'Libre Caslon Text' },
  dateBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  dateText: { fontSize: 13, fontWeight: '600' },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  metricCard: { flex: 1, minWidth: 240, borderWidth: 1, padding: 28, gap: 16 },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  metricIcon: { padding: 12, borderRadius: 8 },
  metricChange: { fontSize: 12, fontWeight: '700' },
  metricLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  metricValue: { fontSize: 38, fontWeight: '400', fontFamily: 'Libre Caslon Text', lineHeight: 42 },
  metricBar: { height: 2, borderRadius: 1, overflow: 'hidden' },
  metricBarFill: { height: '100%', borderRadius: 1 },
  metricDots: { flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 6, borderRadius: 3 },
  metricTrend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricCommission: { fontSize: 12 },
  propertiesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  propertiesTitle: { fontSize: 22, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  propertiesActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  searchField: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, gap: 8, width: 300 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, fontWeight: '500' },
  filterIcon: { width: 44, height: 44, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  table: { borderWidth: 1, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 28, paddingVertical: 16 },
  tableHeaderCell: { flex: 1, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 20, borderBottomWidth: 1 },
  propertyCell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 },
  propertyThumb: { width: 60, height: 48, borderRadius: 4, backgroundColor: '#ddd' },
  propertyName: { fontSize: 16, fontWeight: '700' },
  propertyLocation: { fontSize: 13, marginTop: 2 },
  statusCell: { flex: 1 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, borderRadius: 999, overflow: 'hidden' },
  priceCell: { flex: 1, fontSize: 16, fontWeight: '700' },
  inquiriesCell: { flex: 1 },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 10, fontWeight: '700', color: '#333' },
  moreBtn: { width: 40, alignItems: 'center' },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 },
  paginationInfo: { fontSize: 13 },
  paginationBtns: { flexDirection: 'row', gap: 8 },
  pageBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageBtnActive: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pageBtnText: { fontSize: 13, fontWeight: '700' },
  mobileNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 16, marginBottom: 24 },
  mobileBackBtn: { padding: 8 },
  mobileTitle: { fontSize: 20, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  mobileLogout: { padding: 8 },
});
