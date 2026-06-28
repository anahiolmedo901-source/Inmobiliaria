import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { fetchProperties } from '../services/api';
import { PropertyCard } from '../components/properties/PropertyCard';
import {
  AdvancedPropertyFilters,
  type AdvancedFilters,
} from '../components/properties/AdvancedPropertyFilters';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import type { Property } from '../data/types';

function filterProperties(properties: Property[], filters: AdvancedFilters): Property[] {
  return properties.filter((p) => {
    if (filters.operationType && filters.operationType !== 'cualquiera') {
      const opMap: Record<string, 'sale' | 'rent'> = { compra: 'sale', venta: 'sale', renta: 'rent' };
      const target = opMap[filters.operationType];
      if (target && p.operation !== target) return false;
    }

    if (filters.propertyTypeHabitacional && filters.propertyTypeHabitacional !== 'cualquiera') {
      const typeMap: Record<string, string> = {
        casas: 'villa', departamentos: 'apartment', terrenos: 'land',
        edificios: 'penthouse', finca_rancho: 'estate', otros: 'chalet',
      };
      const target = typeMap[filters.propertyTypeHabitacional];
      if (target && p.type !== target) return false;
    }

    if (filters.priceMin != null && p.price < filters.priceMin) return false;
    if (filters.priceMax != null && p.price > filters.priceMax) return false;

    if (filters.bedrooms != null && p.features.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms != null && p.features.bathrooms < filters.bathrooms) return false;

    if (filters.constructionAreaMin != null && p.features.builtAreaM2 < filters.constructionAreaMin) return false;
    if (filters.constructionAreaMax != null && p.features.builtAreaM2 > filters.constructionAreaMax) return false;

    if (filters.landAreaMin != null && p.features.landAreaM2 < filters.landAreaMin) return false;
    if (filters.landAreaMax != null && p.features.landAreaM2 > filters.landAreaMax) return false;

    if (filters.parkingSpaces != null && p.features.parkingSpaces < filters.parkingSpaces) return false;

    return true;
  });
}

function sortProperties(properties: Property[], sort?: string): Property[] {
  const sorted = [...properties];
  switch (sort) {
    case 'precio_asc': return sorted.sort((a, b) => a.price - b.price);
    case 'precio_desc': return sorted.sort((a, b) => b.price - a.price);
    case 'fecha_asc': return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'fecha_desc':
    default: return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function PropertiesScreen({
  onNavigateProperty,
  onBack,
  searchLocation,
  searchType,
}: {
  onNavigateProperty?: (property: Property) => void;
  onBack?: () => void;
  searchLocation?: string;
  searchType?: string;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const padding = isDesktop ? 64 : 20;

  const [filters, setFilters] = useState<AdvancedFilters>({});
  const [allProperties, setAllProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [search, setSearch] = useState(searchLocation || searchType ? `${searchLocation} ${searchType}`.trim() : '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties({ limit: 100 })
      .then((res) => { if (res.data.length) setAllProperties(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = filterProperties(allProperties, filters);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.label.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    }
    return sortProperties(result, filters.sort);
  }, [allProperties, filters, search]);

  const breadcrumbs = useMemo(
    () => [
      { label: 'Inicio', onPress: onBack },
      { label: 'Propiedades' },
    ],
    [onBack],
  );

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, { paddingHorizontal: padding }]}>
        <Breadcrumbs segments={breadcrumbs} onBack={onBack} />

        <View style={styles.header}>
          <View>
            <Text style={[styles.pageLabel, { color: theme.primary }]}>PORTAFOLIO DE LUJO</Text>
            <Text style={[styles.pageTitle, { color: theme.onSurface }]}>Residencias Excepcionales</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.count, { color: theme.onSurfaceVariant }]}>
              {filtered.length} propiedades
            </Text>
          </View>
        </View>

        <View style={[styles.searchBar, { borderColor: theme.outlineVariant, backgroundColor: theme.surface }]}>
          <Ionicons name="search" size={20} color={theme.outline} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por título, ubicación o tipo..."
            placeholderTextColor={theme.onSurfaceVariant}
            style={[styles.searchInput, { color: theme.onSurface }]}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={theme.onSurfaceVariant} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filterSection}>
          <AdvancedPropertyFilters onApply={setFilters} />
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <Ionicons name="sync" size={32} color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.onSurfaceVariant }]}>Cargando propiedades...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.onSurfaceVariant} />
            <Text style={[styles.emptyTitle, { color: theme.onSurface }]}>Sin resultados</Text>
            <Text style={[styles.emptyDesc, { color: theme.onSurfaceVariant }]}>
              No encontramos propiedades con esos filtros. Intenta ajustar los criterios.
            </Text>
          </View>
        ) : (
          <View style={[styles.grid, { gap: theme.spacing.gutter }]}>
            {filtered.map((property) => (
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, marginTop: 16 },
  pageLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  pageTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  count: { fontSize: 14, fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16, gap: 12 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', paddingVertical: 4 },
  filterSection: { marginBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { flex: 1, minWidth: 280 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', maxWidth: 320 },
  loadingState: { alignItems: 'center', paddingVertical: 80, gap: 16 },
  loadingText: { fontSize: 15, fontWeight: '600' },
});
