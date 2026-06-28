import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { fetchProperties } from '../services/api';
import { HeroCarousel } from '../components/properties/HeroCarousel';
import { PropertyCard } from '../components/properties/PropertyCard';
import type { Property } from '../data/types';

const MOCK_FEATURED = MOCK_PROPERTIES.filter((p) => p.featured);

export function HomeScreen({
  onNavigateProperty,
  onNavigateProperties,
  onNavigateDevelopments,
  onNavigateAgents,
  onNavigateContact,
}: {
  onNavigateProperty?: (property: Property) => void;
  onNavigateProperties?: (searchLocation?: string, searchType?: string) => void;
  onNavigateDevelopments?: () => void;
  onNavigateAgents?: () => void;
  onNavigateContact?: () => void;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [featured, setFeatured] = useState<Property[]>(MOCK_FEATURED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties({ featured: true, limit: 10 })
      .then((res) => { if (res.data.length) setFeatured(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {loading && featured.length === 0 ? (
        <View style={[styles.loadingBanner, { backgroundColor: theme.surfaceContainerHigh }]}>
          <Ionicons name="sync" size={24} color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.onSurfaceVariant }]}>Cargando propiedades destacadas...</Text>
        </View>
      ) : (
        <HeroCarousel properties={featured} onPropertyPress={onNavigateProperty} />
      )}

      <View style={[styles.searchSection, { paddingHorizontal: isDesktop ? 64 : 20 }]}>
        <View style={[styles.searchContainer, { borderColor: theme.outlineVariant, backgroundColor: theme.surface }]}>
          <View style={styles.searchRow}>
            <View style={styles.searchField}>
              <Ionicons name="location" size={20} color={theme.primary} />
              <TextInput
                value={searchLocation}
                onChangeText={setSearchLocation}
                placeholder="Ubicación, ciudad o código postal"
                placeholderTextColor={theme.onSurfaceVariant}
                style={[styles.searchInput, { color: theme.onSurface }]}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.outlineVariant }]} />
            <View style={styles.searchField}>
              <Ionicons name="home" size={20} color={theme.primary} />
              <TextInput
                value={searchType}
                onChangeText={setSearchType}
                placeholder="Tipo de propiedad"
                placeholderTextColor={theme.onSurfaceVariant}
                style={[styles.searchInput, { color: theme.onSurface }]}
              />
            </View>
            <Pressable
              onPress={() => onNavigateProperties?.(searchLocation, searchType)}
              style={({ pressed }) => [
                styles.searchBtn,
                { backgroundColor: theme.primaryContainer, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Ionicons name="search" size={20} color={theme.onPrimaryContainer} />
              <Text style={[styles.searchBtnText, { color: theme.onPrimaryContainer }]}>Buscar</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Featured Listings */}
      <View style={[styles.section, { paddingHorizontal: isDesktop ? 64 : 20 }]}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionLabel, { color: theme.primary }]}>COLECCIÓN DESTACADA</Text>
            <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Residencias Excepcionales</Text>
          </View>
          <Pressable onPress={() => onNavigateProperties?.()}>
            <Text style={[styles.viewAll, { color: theme.primary }]}>Ver Inventario Global</Text>
          </Pressable>
        </View>

        <View style={[styles.grid, { gap: theme.spacing.gutter }]}>
          {featured.map((property) => (
            <View key={property.id} style={[styles.gridItem, isDesktop && { width: '30%' }]}>
              <PropertyCard property={property} onPress={() => onNavigateProperty?.(property)} />
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={[styles.ctaSection, { backgroundColor: theme.surfaceContainer }]}>
        <View style={[styles.ctaInner, { maxWidth: theme.spacing.containerMax, paddingHorizontal: isDesktop ? 64 : 20 }]}>
          <View style={isDesktop ? styles.ctaGrid : styles.ctaStack}>
            <View style={styles.ctaImageWrap}>
              <View style={styles.ctaImageBorder}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' }}
                  style={styles.ctaImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.ctaContent}>
              <Text style={[styles.ctaLabel, { color: theme.primary }]}>ASESORÍA PRIVADA</Text>
              <Text style={[styles.ctaTitle, { color: theme.onSurface }]}>
                Discreción{' '}
                <Text style={{ color: theme.primary }}>Exclusiva</Text>
              </Text>
              <Text style={[styles.ctaDesc, { color: theme.onSurfaceVariant }]}>
                Para las adquisiciones más exclusivas del mundo, la privacidad es el lujo definitivo.
                Nuestro servicio de Discreción Elite proporciona un blindaje completo para tu identidad
                mientras exploras oportunidades globales fuera del mercado.
              </Text>

              <View style={styles.ctaFeatures}>
                <View style={styles.ctaFeature}>
                  <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
                  <View>
                    <Text style={[styles.ctaFeatureTitle, { color: theme.onSurface }]}>Adquisición Anónima</Text>
                    <Text style={[styles.ctaFeatureDesc, { color: theme.onSurfaceVariant }]}>
                      Estructuras legales seguras para anonimato total.
                    </Text>
                  </View>
                </View>
                <View style={styles.ctaFeature}>
                  <Ionicons name="lock-closed" size={20} color={theme.primary} />
                  <View>
                    <Text style={[styles.ctaFeatureTitle, { color: theme.onSurface }]}>Acceso Exclusivo</Text>
                    <Text style={[styles.ctaFeatureDesc, { color: theme.onSurfaceVariant }]}>
                      Propiedades nunca listadas en portales públicos.
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={onNavigateContact}
                style={({ pressed }) => [
                  styles.ctaBtn,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Text style={[styles.ctaBtnText, { color: theme.onPrimary }]}>Solicitar Consultoría</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Quote Section */}
      <View style={[styles.quoteSection, { borderTopColor: theme.outlineVariant, borderBottomColor: theme.outlineVariant }]}>
        <Ionicons name="chatbubble-ellipses" size={40} color={theme.primaryContainer} />
        <Text style={[styles.quoteText, { color: theme.onSurface }]}>
          "El lujo no es lo opuesto a la pobreza; es lo opuesto a la vulgaridad."
        </Text>
        <View style={[styles.quoteDivider, { backgroundColor: theme.primary }]} />
        <Text style={[styles.quoteAuthor, { color: theme.onSurfaceVariant }]}>— Coco Chanel</Text>
      </View>

      {/* Newsletter */}
      <View style={[styles.newsletterSection, { paddingHorizontal: isDesktop ? 64 : 20, backgroundColor: theme.surfaceContainer }]}>
        <View style={styles.newsletterInner}>
          <Text style={[styles.newsletterTitle, { color: theme.onSurface }]}>Acceso Exclusivo</Text>
          <Text style={[styles.newsletterDesc, { color: theme.onSurfaceVariant }]}>
            Únete a nuestra lista privada para recibir planos anticipados, oportunidades de inversión
            y análisis arquitectónicos profundos.
          </Text>
          <View style={styles.newsletterForm}>
            <TextInput
              placeholder="Correo Electrónico"
              placeholderTextColor={theme.onSurfaceVariant}
              style={[styles.newsletterInput, { backgroundColor: theme.surfaceContainerLowest, color: theme.onSurface, borderColor: theme.outlineVariant }]}
              value={newsletterEmail}
              onChangeText={setNewsletterEmail}
            />
            <Pressable
              onPress={() => {
                if (newsletterEmail.trim()) {
                  alert('Gracias por suscribirte. Pronto recibirás nuestras novedades.');
                  setNewsletterEmail('');
                }
              }}
              style={({ pressed }) => [
                styles.newsletterBtn,
                { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={[styles.newsletterBtnText, { color: theme.onPrimary }]}>SUSCRIBIRSE</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.onSecondaryFixed }]}>
        <View style={[styles.footerInner, { paddingHorizontal: isDesktop ? 64 : 20 }]}>
          <View style={styles.footerGrid}>
            <View>
              <Text style={[styles.footerBrand, { color: theme.primaryFixed }]}>VIVIANA</Text>
              <Text style={[styles.footerDesc, { color: theme.secondaryFixedDim + 'b3' }]}>
                Redefiniendo el mercado inmobiliario de lujo a través de la excelencia arquitectónica
                y conocimiento de mercado sin paralelo en México.
              </Text>
            </View>
            <View style={styles.footerLinks}>
              <View>
                <Text style={[styles.footerLinkTitle, { color: theme.primaryFixed }]}>Navegación</Text>
                <Pressable onPress={() => onNavigateProperties?.()}>
                  <Text style={[styles.footerLink, { color: theme.secondaryFixedDim + 'b3' }]}>Propiedades</Text>
                </Pressable>
                <Pressable onPress={onNavigateDevelopments}>
                  <Text style={[styles.footerLink, { color: theme.secondaryFixedDim + 'b3' }]}>Desarrollos</Text>
                </Pressable>
                <Pressable onPress={onNavigateAgents}>
                  <Text style={[styles.footerLink, { color: theme.secondaryFixedDim + 'b3' }]}>Agentes</Text>
                </Pressable>
              </View>
              <View>
                <Text style={[styles.footerLinkTitle, { color: theme.primaryFixed }]}>Legal</Text>
                <Text style={[styles.footerLink, { color: theme.secondaryFixedDim + 'b3' }]}>Aviso de Privacidad</Text>
                <Text style={[styles.footerLink, { color: theme.secondaryFixedDim + 'b3' }]}>Términos del Servicio</Text>
                <Text style={[styles.footerLink, { color: theme.secondaryFixedDim + 'b3' }]}>Accesibilidad</Text>
              </View>
            </View>
          </View>
          <View style={[styles.footerBottom, { borderTopColor: theme.outlineVariant + '20' }]}>
            <Text style={[styles.footerCopy, { color: theme.secondaryFixedDim + '80' }]}>
              © 2025 Viviana Bienes Raíces. Todos los derechos reservados.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  searchSection: { marginTop: -40, zIndex: 10, paddingBottom: 80 },
  searchContainer: { borderWidth: 1, borderRadius: 16, padding: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  searchField: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  divider: { width: 1, height: 32 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  searchBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  searchBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  section: { paddingBottom: 120 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  sectionTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text', lineHeight: 48 },
  viewAll: { fontSize: 13, fontWeight: '700', borderBottomWidth: 1, borderBottomColor: '#c9a14a', paddingBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { flex: 1, minWidth: 280 },
  ctaSection: { paddingVertical: 120 },
  ctaInner: { marginHorizontal: 'auto', width: '100%' },
  ctaGrid: { flexDirection: 'row', gap: 80, alignItems: 'center' },
  ctaStack: { flexDirection: 'column', gap: 40 },
  ctaImageWrap: { flex: 1 },
  ctaImageBorder: { aspectRatio: 1, borderRadius: 12, overflow: 'hidden', borderWidth: 8, borderColor: '#ffffff' },
  ctaImage: { width: '100%', height: '100%' },
  ctaContent: { flex: 1, gap: 24 },
  ctaLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  ctaTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text', lineHeight: 50 },
  ctaDesc: { fontSize: 16, lineHeight: 26 },
  ctaFeatures: { gap: 20 },
  ctaFeature: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  ctaFeatureTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  ctaFeatureDesc: { fontSize: 14 },
  ctaBtn: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 8, alignSelf: 'flex-start' },
  ctaBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  quoteSection: { paddingVertical: 100, alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, gap: 20 },
  quoteText: { fontSize: 28, fontFamily: 'Libre Caslon Text', fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 40, lineHeight: 38 },
  quoteDivider: { width: 48, height: 1 },
  quoteAuthor: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  newsletterSection: { paddingVertical: 100 },
  newsletterInner: { maxWidth: 600, gap: 24 },
  newsletterTitle: { fontSize: 40, fontWeight: '400', fontFamily: 'Libre Caslon Text' },
  newsletterDesc: { fontSize: 16, lineHeight: 26 },
  newsletterForm: { flexDirection: 'row', gap: 12 },
  newsletterInput: { flex: 1, borderWidth: 1, borderRadius: 4, paddingHorizontal: 20, paddingVertical: 16, fontSize: 15 },
  newsletterBtn: { paddingHorizontal: 36, paddingVertical: 16, borderRadius: 4, justifyContent: 'center' },
  newsletterBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  footer: { paddingVertical: 100 },
  footerInner: { maxWidth: 1280, marginHorizontal: 'auto', width: '100%' },
  footerGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 40 },
  footerBrand: { fontSize: 24, fontWeight: '700', fontFamily: 'Libre Caslon Text', marginBottom: 20 },
  footerDesc: { fontSize: 14, lineHeight: 22, maxWidth: 300 },
  footerLinks: { flexDirection: 'row', gap: 60 },
  footerLinkTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 20 },
  footerLink: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  footerBottom: { borderTopWidth: 1, marginTop: 60, paddingTop: 30 },
  footerCopy: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  loadingBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 80, marginHorizontal: 20 },
  loadingText: { fontSize: 15, fontWeight: '600' },
});
