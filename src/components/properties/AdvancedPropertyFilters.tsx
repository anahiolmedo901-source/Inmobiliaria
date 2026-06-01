import React, { useMemo, useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { PickerField } from './PickerField';

export type OperationType = 'compra' | 'venta' | 'renta' | 'cualquiera';
export type HabitacionalType =
  | 'casas'
  | 'departamentos'
  | 'terrenos'
  | 'edificios'
  | 'finca_rancho'
  | 'otros'
  | 'cualquiera';

export type SortType = 'precio_asc' | 'precio_desc' | 'fecha_desc' | 'fecha_asc';

export type AdvancedFilters = {
  operationType?: OperationType;
  propertyTypeHabitacional?: HabitacionalType;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  constructionAreaMin?: number;
  constructionAreaMax?: number;
  landAreaMin?: number;
  landAreaMax?: number;
  parkingSpaces?: number;
  sort?: SortType;
};

function parseNullableNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

const keyboardNumeric: KeyboardTypeOptions = 'numeric';

export function AdvancedPropertyFilters({
  onApply,
}: {
  onApply?: (filters: AdvancedFilters) => void;
}) {
  const { theme } = useAppTheme();
  const [expanded, setExpanded] = useState(true);

  const [operationType, setOperationType] = useState<OperationType>('cualquiera');
  const [propertyTypeHabitacional, setPropertyTypeHabitacional] = useState<HabitacionalType>('cualquiera');

  const [priceMinRaw, setPriceMinRaw] = useState<string>('');
  const [priceMaxRaw, setPriceMaxRaw] = useState<string>('');

  const [bedroomsRaw, setBedroomsRaw] = useState<string>('');
  const [bathroomsRaw, setBathroomsRaw] = useState<string>('');

  const [constructionAreaMinRaw, setConstructionAreaMinRaw] = useState<string>('');
  const [constructionAreaMaxRaw, setConstructionAreaMaxRaw] = useState<string>('');
  const [landAreaMinRaw, setLandAreaMinRaw] = useState<string>('');
  const [landAreaMaxRaw, setLandAreaMaxRaw] = useState<string>('');

  const [parkingSpacesRaw, setParkingSpacesRaw] = useState<string>('');

  const [sort, setSort] = useState<SortType>('fecha_desc');

  const filters = useMemo<AdvancedFilters>(() => {
    const operationTypeValue = operationType === 'cualquiera' ? undefined : operationType;
    const propertyTypeHabitacionalValue = propertyTypeHabitacional === 'cualquiera' ? undefined : propertyTypeHabitacional;

    return {
      operationType: operationTypeValue,
      propertyTypeHabitacional: propertyTypeHabitacionalValue,
      priceMin: parseNullableNumber(priceMinRaw),
      priceMax: parseNullableNumber(priceMaxRaw),
      bedrooms: parseNullableNumber(bedroomsRaw),
      bathrooms: parseNullableNumber(bathroomsRaw),
      constructionAreaMin: parseNullableNumber(constructionAreaMinRaw),
      constructionAreaMax: parseNullableNumber(constructionAreaMaxRaw),
      landAreaMin: parseNullableNumber(landAreaMinRaw),
      landAreaMax: parseNullableNumber(landAreaMaxRaw),
      parkingSpaces: parseNullableNumber(parkingSpacesRaw),
      sort,
    };
  }, [
    bedroomsRaw, bathroomsRaw, constructionAreaMaxRaw, constructionAreaMinRaw,
    landAreaMaxRaw, landAreaMinRaw, operationType, parkingSpacesRaw,
    priceMaxRaw, priceMinRaw, propertyTypeHabitacional, sort,
  ]);

  function handleReset() {
    setExpanded(true);
    setOperationType('cualquiera');
    setPropertyTypeHabitacional('cualquiera');
    setPriceMinRaw(''); setPriceMaxRaw('');
    setBedroomsRaw(''); setBathroomsRaw('');
    setConstructionAreaMinRaw(''); setConstructionAreaMaxRaw('');
    setLandAreaMinRaw(''); setLandAreaMaxRaw('');
    setParkingSpacesRaw('');
    setSort('fecha_desc');
    onApply?.({});
  }

  function handleApply() {
    onApply?.(filters);
  }

  const operationOptions = [
    { label: 'Compra', value: 'compra' },
    { label: 'Venta', value: 'venta' },
    { label: 'Renta', value: 'renta' },
    { label: 'Cualquiera', value: 'cualquiera' },
  ];

  const propertyOptions = [
    { label: 'Casas', value: 'casas' },
    { label: 'Departamentos', value: 'departamentos' },
    { label: 'Terrenos', value: 'terrenos' },
    { label: 'Edificios', value: 'edificios' },
    { label: 'Finca / Rancho', value: 'finca_rancho' },
    { label: 'Otros', value: 'otros' },
    { label: 'Cualquiera', value: 'cualquiera' },
  ];

  const sortOptions = [
    { label: 'Precio: menor a mayor', value: 'precio_asc' },
    { label: 'Precio: mayor a menor', value: 'precio_desc' },
    { label: 'Fecha: más recientes', value: 'fecha_desc' },
    { label: 'Fecha: más antiguas', value: 'fecha_asc' },
  ];

  return (
    <View style={[styles.wrapper, { borderColor: theme.outlineVariant, backgroundColor: theme.surface }]}>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }, styles.header]}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="filter" size={18} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.onSurface }]}>Filtros avanzados</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={theme.onSurfaceVariant} />
      </Pressable>

      {expanded ? (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Tipo de operación</Text>
            <PickerField
              selectedValue={operationType}
              onValueChange={(v) => setOperationType(v as OperationType)}
              options={operationOptions}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Tipo de propiedad (habitacional)</Text>
            <PickerField
              selectedValue={propertyTypeHabitacional}
              onValueChange={(v) => setPropertyTypeHabitacional(v as HabitacionalType)}
              options={propertyOptions}
            />
          </View>

          <View style={styles.twoCols}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Precio min.</Text>
              <TextInput
                value={priceMinRaw}
                onChangeText={setPriceMinRaw}
                placeholder="$"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Precio max.</Text>
              <TextInput
                value={priceMaxRaw}
                onChangeText={setPriceMaxRaw}
                placeholder="$"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Recámaras</Text>
              <TextInput
                value={bedroomsRaw}
                onChangeText={setBedroomsRaw}
                placeholder="Ej: 3"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Baños</Text>
              <TextInput
                value={bathroomsRaw}
                onChangeText={setBathroomsRaw}
                placeholder="Ej: 2"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
          </View>

          <Text style={[styles.groupTitle, { color: theme.onSurfaceVariant }]}>Metros cuadrados</Text>

          <View style={styles.twoCols}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Construcción min.</Text>
              <TextInput
                value={constructionAreaMinRaw}
                onChangeText={setConstructionAreaMinRaw}
                placeholder="m2"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Construcción max.</Text>
              <TextInput
                value={constructionAreaMaxRaw}
                onChangeText={setConstructionAreaMaxRaw}
                placeholder="m2"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Terreno min.</Text>
              <TextInput
                value={landAreaMinRaw}
                onChangeText={setLandAreaMinRaw}
                placeholder="m2"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Terreno max.</Text>
              <TextInput
                value={landAreaMaxRaw}
                onChangeText={setLandAreaMaxRaw}
                placeholder="m2"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType={keyboardNumeric}
                style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Cajones de estacionamiento</Text>
            <TextInput
              value={parkingSpacesRaw}
              onChangeText={setParkingSpacesRaw}
              placeholder="Ej: 2"
              placeholderTextColor={theme.onSurfaceVariant}
              keyboardType={keyboardNumeric}
              style={[styles.input, { borderColor: theme.outlineVariant, color: theme.onSurface }]}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>Ordenamiento</Text>
            <PickerField
              selectedValue={sort}
              onValueChange={(v) => setSort(v as SortType)}
              options={sortOptions}
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.92 },
                { borderColor: theme.outlineVariant },
              ]}
            >
              <Text style={[styles.secondaryBtnText, { color: theme.onSurfaceVariant }]}>Restablecer</Text>
            </Pressable>

            <Pressable
              onPress={handleApply}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.92 },
              ]}
            >
              <Text style={[styles.primaryBtnText]}>Aplicar</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 14,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  twoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#C9A14A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#1C1C1C',
    fontWeight: '900',
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontWeight: '900',
    fontSize: 14,
  },
});
