import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { validateCredentials, MOCK_CREDENTIALS_HINT } from '../utils/login';
import type { AuthRole } from '../theme/ThemeContext';

export function LoginScreen({
  onLogin,
  onBack,
}: {
  onLogin?: (role: AuthRole, email: string) => void;
  onBack?: () => void;
}) {
  const { theme } = useAppTheme();
  const [tab, setTab] = useState<'cliente' | 'agente'>('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setError(null);

    const result = validateCredentials({ email, password });
    if (!result.success) {
      setError(result.error ?? 'Error desconocido');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLogin?.(result.role ?? 'public', email);
    }, 800);
  }

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} contentContainerStyle={styles.pageInner}>
      <View style={styles.bgWrap}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80' }}
          style={styles.bgImage}
          resizeMode="cover"
        />
        <View style={styles.bgOverlay} />
      </View>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>VIVIANA</Text>
          <Text style={styles.headerSub}>Bienes Raíces Premium en México</Text>
        </View>

        <View style={[styles.modal, { backgroundColor: theme.surfaceContainerLowest }]}>
          <View style={[styles.tabs, { borderBottomColor: theme.outlineVariant }]}>
            <Pressable
              onPress={() => { setTab('cliente'); setError(null); }}
              style={[styles.tab, tab === 'cliente' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.tabText, { color: tab === 'cliente' ? theme.primary : theme.onSurfaceVariant }]}>
                CLIENTE
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { setTab('agente'); setError(null); }}
              style={[styles.tab, tab === 'agente' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.tabText, { color: tab === 'agente' ? theme.primary : theme.onSurfaceVariant }]}>
                AGENTE
              </Text>
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.formTitle, { color: theme.onSurface }]}>
              {tab === 'cliente' ? 'Bienvenido de Vuelta' : 'Acceso para Agentes'}
            </Text>
            <Text style={[styles.formSubtitle, { color: theme.onSurfaceVariant }]}>
              {tab === 'cliente'
                ? 'Ingresa tus credenciales privadas para acceder a tu portafolio.'
                : 'Accede a la base de datos global de propiedades y herramientas de gestión.'}
            </Text>

            {/* Social Login */}
            <View style={styles.socialRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialBtn,
                  { borderColor: theme.outlineVariant, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Ionicons name="logo-google" size={20} color={theme.onSurface} />
                <Text style={[styles.socialText, { color: theme.onSurface }]}>Google</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.socialBtn,
                  { borderColor: theme.outlineVariant, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Ionicons name="logo-apple" size={20} color={theme.onSurface} />
                <Text style={[styles.socialText, { color: theme.onSurface }]}>Apple</Text>
              </Pressable>
            </View>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.outlineVariant }]} />
              <Text style={[styles.dividerText, { color: theme.outline }]}>O</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.outlineVariant }]} />
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error ? (
                <View style={[styles.errorBox, { backgroundColor: theme.errorContainer + '80' }]}>
                  <Ionicons name="alert-circle" size={18} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.onErrorContainer }]}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: theme.onSurfaceVariant }]}>CORREO ELECTRÓNICO</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={theme.onSurfaceVariant}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.fieldInput, { color: theme.onSurface, borderBottomColor: theme.outlineVariant }]}
                />
              </View>

              <View style={styles.field}>
                <View style={styles.fieldHeader}>
                  <Text style={[styles.fieldLabel, { color: theme.onSurfaceVariant }]}>CONTRASEÑA</Text>
                  <Pressable>
                    <Text style={[styles.forgotLink, { color: theme.primary }]}>¿Olvidaste?</Text>
                  </Pressable>
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.onSurfaceVariant}
                  secureTextEntry
                  style={[styles.fieldInput, { color: theme.onSurface, borderBottomColor: theme.outlineVariant }]}
                />
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                style={({ pressed }) => [
                  styles.loginBtn,
                  { backgroundColor: theme.primary, opacity: (pressed || loading) ? 0.9 : 1 },
                ]}
              >
                <Text style={[styles.loginBtnText, { color: theme.onPrimary }]}>
                  {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.footerText, { color: theme.onSurfaceVariant }]}>
              ¿No eres miembro del círculo exclusivo?
              <Text style={{ color: theme.primary, fontWeight: '700' }}> Solicitar Invitación</Text>
            </Text>

            <View style={[styles.hintBox, { backgroundColor: theme.surfaceContainer, borderColor: theme.outlineVariant }]}>
              <Ionicons name="information-circle" size={16} color={theme.primary} />
              <Text style={[styles.hintText, { color: theme.onSurfaceVariant }]}>
                Usa admin@viviana.mx / admin123 para acceso completo
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerLinksRow}>
          <Text style={[styles.footerLink, { color: 'rgba(255,255,255,0.6)' }]}>Privacidad</Text>
          <Text style={[styles.footerLink, { color: 'rgba(255,255,255,0.6)' }]}>Seguridad</Text>
          <Text style={[styles.footerLink, { color: 'rgba(255,255,255,0.6)' }]}>Conserjería</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageInner: { minHeight: '100%', justifyContent: 'center', alignItems: 'center', padding: 40 },
  bgWrap: { ...StyleSheet.absoluteFill },
  bgImage: { width: '100%', height: '100%' },
  bgOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { width: '100%', maxWidth: 480, zIndex: 10, gap: 40 },
  header: { alignItems: 'center', gap: 8 },
  headerBrand: { fontSize: 40, fontWeight: '700', fontFamily: 'Libre Caslon Text', color: '#ffffff', letterSpacing: 1 },
  headerSub: { fontSize: 13, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.8)' },
  modal: { borderRadius: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 32, elevation: 16 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 18, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  modalBody: { padding: 40, gap: 24 },
  formTitle: { fontSize: 22, fontWeight: '700', fontFamily: 'Libre Caslon Text' },
  formSubtitle: { fontSize: 14, lineHeight: 22 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, paddingVertical: 14, borderRadius: 8 },
  socialText: { fontSize: 13, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  form: { gap: 20 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 8 },
  errorText: { fontSize: 13, fontWeight: '600', flex: 1 },
  field: { gap: 8 },
  fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  forgotLink: { fontSize: 12, fontWeight: '600' },
  fieldInput: { borderBottomWidth: 1, paddingVertical: 12, fontSize: 15, fontWeight: '500' },
  loginBtn: { paddingVertical: 18, alignItems: 'center', borderRadius: 4, marginTop: 8 },
  loginBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  footerText: { fontSize: 14, textAlign: 'center' },
  hintBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 8 },
  hintText: { fontSize: 11, fontWeight: '600', flex: 1 },
  footerLinksRow: { flexDirection: 'row', justifyContent: 'center', gap: 32 },
  footerLink: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});
