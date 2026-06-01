import React from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

const OFFICES = [
  {
    city: 'CDMX',
    address: 'Paseo de la Reforma 222, Col. Juárez',
    postal: 'CDMX 06600, México',
    phone: '+52 (55) 1234 5678',
    email: 'cdmx@viviana.mx',
    lat: 19.4252,
    lng: -99.1636,
    hours: 'Lun–Vie 9:00–19:00',
    icon: 'business' as const,
  },
  {
    city: 'Puerto Vallarta',
    address: 'Av. México 123, Zona Hotelera',
    postal: 'Puerto Vallarta, Jal. 48300',
    phone: '+52 (322) 123 4567',
    email: 'vallarta@viviana.mx',
    lat: 20.6534,
    lng: -105.2253,
    hours: 'Lun–Sáb 9:00–18:00',
    icon: 'business' as const,
  },
  {
    city: 'Los Cabos',
    address: 'Boulevard Marina 45, Cabo San Lucas',
    postal: 'Los Cabos, BCS 23450',
    phone: '+52 (624) 123 4567',
    email: 'cabos@viviana.mx',
    lat: 22.8905,
    lng: -109.9167,
    hours: 'Lun–Vie 9:00–18:00',
    icon: 'business' as const,
  },
  {
    city: 'San Miguel de Allende',
    address: 'Canal 12, Centro',
    postal: 'San Miguel de Allende, Gto. 37700',
    phone: '+52 (415) 123 4567',
    email: 'sma@viviana.mx',
    lat: 20.9146,
    lng: -100.7438,
    hours: 'Lun–Vie 10:00–17:00',
    icon: 'business' as const,
  },
];

export function ContactScreen({ onBack }: { onBack?: () => void }) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const padding = isDesktop ? 64 : 20;

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, { paddingHorizontal: padding }]}>
        <Breadcrumbs segments={[{ label: 'Contacto' }]} onBack={onBack} />

        <View style={styles.hero}>
          <Text style={[styles.heroLabel, { color: theme.primary }]}>CONTACTO</Text>
          <Text style={[styles.heroTitle, { color: theme.onSurface }]}>Nuestras Oficinas</Text>
          <Text style={[styles.heroDesc, { color: theme.onSurfaceVariant }]}>
            Estamos presentes en los destinos más exclusivos de México. Contáctanos directamente
            en la oficina más cercana o a través de nuestros canales centrales.
          </Text>
        </View>

        <View style={styles.centralRow}>
          <View style={[styles.centralCard, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}>
            <Ionicons name="call" size={24} color={theme.primary} />
            <Text style={[styles.centralLabel, { color: theme.onSurfaceVariant }]}>Central Telefónica</Text>
            <Text style={[styles.centralValue, { color: theme.onSurface }]}>+52 (55) 8000 VIVIANA</Text>
            <Text style={[styles.centralSub, { color: theme.onSurfaceVariant }]}>Disponible 24/7</Text>
            <Pressable
              onPress={() => Linking.openURL('tel:+525580004848').catch(() => {})}
              style={({ pressed }) => [styles.callBtn, { backgroundColor: theme.primary }, pressed && { opacity: 0.9 }]}
            >
              <Ionicons name="call" size={16} color={theme.onPrimary} />
              <Text style={[styles.callBtnText, { color: theme.onPrimary }]}>Llamar Ahora</Text>
            </Pressable>
          </View>
          <View style={[styles.centralCard, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}>
            <Ionicons name="mail" size={24} color={theme.primary} />
            <Text style={[styles.centralLabel, { color: theme.onSurfaceVariant }]}>Correo Electrónico</Text>
            <Text style={[styles.centralValue, { color: theme.onSurface }]}>hola@viviana.mx</Text>
            <Text style={[styles.centralSub, { color: theme.onSurfaceVariant }]}>Respuesta en menos de 2h</Text>
            <Pressable
              onPress={() => Linking.openURL('mailto:hola@viviana.mx').catch(() => {})}
              style={({ pressed }) => [styles.callBtn, { backgroundColor: theme.primary }, pressed && { opacity: 0.9 }]}
            >
              <Ionicons name="mail" size={16} color={theme.onPrimary} />
              <Text style={[styles.callBtnText, { color: theme.onPrimary }]}>Enviar Correo</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.officesGrid}>
          {OFFICES.map((office) => (
            <View
              key={office.city}
              style={[styles.officeCard, { backgroundColor: theme.surface, borderColor: theme.outlineVariant }]}
            >
              <View style={styles.officeHeader}>
                <View style={[styles.officeIcon, { backgroundColor: theme.primaryContainer + '40' }]}>
                  <Ionicons name={office.icon} size={22} color={theme.primary} />
                </View>
                <Text style={[styles.officeCity, { color: theme.onSurface }]}>{office.city}</Text>
              </View>
              <View style={styles.officeDetails}>
                <View style={styles.officeRow}>
                  <Ionicons name="location" size={14} color={theme.primary} />
                  <Text style={[styles.officeText, { color: theme.onSurfaceVariant }]}>
                    {office.address}, {office.postal}
                  </Text>
                </View>
                <View style={styles.officeRow}>
                  <Ionicons name="call" size={14} color={theme.primary} />
                  <Pressable onPress={() => Linking.openURL(`tel:${office.phone.replace(/[^\d+]/g, '')}`).catch(() => {})}>
                    <Text style={[styles.officeText, { color: theme.primary }]}>{office.phone}</Text>
                  </Pressable>
                </View>
                <View style={styles.officeRow}>
                  <Ionicons name="mail" size={14} color={theme.primary} />
                  <Pressable onPress={() => Linking.openURL(`mailto:${office.email}`).catch(() => {})}>
                    <Text style={[styles.officeText, { color: theme.primary }]}>{office.email}</Text>
                  </Pressable>
                </View>
                <View style={styles.officeRow}>
                  <Ionicons name="time" size={14} color={theme.primary} />
                  <Text style={[styles.officeText, { color: theme.onSurfaceVariant }]}>{office.hours}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  inner: { paddingVertical: 16, maxWidth: 1280, marginHorizontal: 'auto', width: '100%' },
  hero: { marginBottom: 48 },
  heroLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  heroTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text', lineHeight: 48, marginBottom: 16 },
  heroDesc: { fontSize: 16, lineHeight: 26, maxWidth: 600 },
  centralRow: { flexDirection: 'row', gap: 24, marginBottom: 48, flexWrap: 'wrap' },
  centralCard: { flex: 1, minWidth: 260, borderWidth: 1, borderRadius: 16, padding: 28, gap: 12, alignItems: 'center' },
  centralLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  centralValue: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  centralSub: { fontSize: 12, textAlign: 'center' },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 4 },
  callBtnText: { fontSize: 13, fontWeight: '700' },
  officesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginBottom: 80 },
  officeCard: { flex: 1, minWidth: 260, borderWidth: 1, borderRadius: 16, padding: 24, gap: 16 },
  officeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  officeIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  officeCity: { fontSize: 22, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  officeDetails: { gap: 12 },
  officeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  officeText: { fontSize: 13, fontWeight: '600', flex: 1 },
});
