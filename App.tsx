import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, useAppTheme, type AuthRole } from './src/theme/ThemeContext';
import { NavBar, type NavItem } from './src/components/navigation/NavBar';
import { DrawerMenu } from './src/components/navigation/DrawerMenu';
import { HomeScreen } from './src/screens/HomeScreen';
import { PropertiesScreen } from './src/screens/PropertiesScreen';
import { PropertyDetailScreen } from './src/screens/PropertyDetailScreen';
import { DevelopmentsScreen } from './src/screens/DevelopmentsScreen';
import { AgentsScreen } from './src/screens/AgentsScreen';
import { AgentPortfolioScreen } from './src/screens/AgentPortfolioScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import type { Property } from './src/data/types';
import type { PropertyAgent } from './src/data/types';
import { MOCK_PROPERTIES } from './src/data/mockProperties';
import { MOCK_AGENTS } from './src/data/mockAgents';
import { fetchMe, getStoredToken, clearToken } from './src/services/api';
import { useUrlRouter } from './src/utils/router';

const LOGGED_USER_AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80';

function findPropertyById(id: string): Property | undefined {
  return MOCK_PROPERTIES.find((p) => p.id === id);
}

function AppNavigator() {
  const { mode, theme, role, setRole } = useAppTheme();
  const { route, navigate } = useUrlRouter('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<PropertyAgent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');

  const isLoggedIn = role !== 'public' && userEmail !== null;

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchMe()
        .then((user) => {
          const r = (user.role === 'agent' ? 'agent' : user.role === 'admin' ? 'admin' : 'public') as AuthRole;
          setRole(r);
          setUserEmail(user.email);
          setUserName(user.name);
        })
        .catch(() => {
          clearToken();
        });
    }
  }, [setRole]);

  const go = useCallback((target: 'home' | 'properties' | 'developments' | 'agents' | 'contact' | 'login' | 'dashboard') => {
    setDrawerOpen(false);
    setSelectedProperty(null);
    setSelectedAgent(null);
    navigate(target);
  }, [navigate]);

  const handleProperties = useCallback((loc?: string, type?: string) => {
    setSearchLocation(loc ?? '');
    setSearchType(type ?? '');
    go('properties');
  }, [go]);

  const handlePropertyPress = useCallback((property: Property) => {
    setSelectedProperty(property);
    navigate('propertyDetail');
  }, [navigate]);

  const handleAgentPress = useCallback((agent: PropertyAgent) => {
    setSelectedAgent(agent);
    navigate('agentPortfolio');
  }, [navigate]);

  const handleLogin = useCallback((newRole?: AuthRole, email?: string, name?: string) => {
    if (newRole) setRole(newRole);
    if (email) setUserEmail(email);
    if (name) setUserName(name);
    go(newRole === 'public' ? 'home' : 'dashboard');
  }, [setRole, go]);

  const handleLogout = useCallback(() => {
    clearToken();
    setRole('public');
    setUserEmail(null);
    setUserName(null);
    go('home');
  }, [setRole, go]);

  const navItems: NavItem[] = useMemo(() => [
    { key: 'home', label: 'Inicio', active: route === 'home', onPress: () => go('home') },
    { key: 'properties', label: 'Propiedades', active: route === 'properties', onPress: () => go('properties') },
    { key: 'developments', label: 'Desarrollos', active: route === 'developments', onPress: () => go('developments') },
    { key: 'agents', label: 'Agentes', active: route === 'agents', onPress: () => go('agents') },
    { key: 'contact', label: 'Contacto', active: route === 'contact', onPress: () => go('contact') },
  ], [route, go]);

  const showNavBar = route !== 'login' && route !== 'dashboard';
  const showDrawerButton = route !== 'login' && route !== 'dashboard';

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      {showNavBar ? (
        <NavBar
          items={navItems}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogin={() => go('login')}
          onDashboard={() => go('dashboard')}
          onMenuToggle={() => setDrawerOpen(true)}
          showMenuButton={showDrawerButton}
        />
      ) : null}

      {route === 'home' && (
        <HomeScreen
          onNavigateProperty={handlePropertyPress}
          onNavigateProperties={handleProperties}
          onNavigateDevelopments={() => go('developments')}
          onNavigateAgents={() => go('agents')}
          onNavigateContact={() => go('contact')}
        />
      )}

      {route === 'properties' && (
        <PropertiesScreen
          onNavigateProperty={handlePropertyPress}
          onBack={() => go('home')}
          searchLocation={searchLocation}
          searchType={searchType}
        />
      )}

      {route === 'propertyDetail' && selectedProperty && (
        <PropertyDetailScreen property={selectedProperty} onBack={() => go('properties')} />
      )}

      {route === 'developments' && (
        <DevelopmentsScreen onBack={() => go('home')} onNavigateProperty={handlePropertyPress} />
      )}

      {route === 'agents' && (
        <AgentsScreen onBack={() => go('home')} onNavigateAgent={handleAgentPress} />
      )}

      {route === 'agentPortfolio' && selectedAgent && (
        <AgentPortfolioScreen agent={selectedAgent} onBack={() => go('agents')} onNavigateProperty={handlePropertyPress} />
      )}

      {route === 'contact' && (
        <ContactScreen onBack={() => go('home')} />
      )}

      {route === 'login' && (
        <LoginScreen onLogin={handleLogin} onBack={() => go('home')} />
      )}

      {route === 'dashboard' && (
        <DashboardScreen
          userName={userName}
          role={role}
          userAvatar={LOGGED_USER_AVATAR}
          onLogout={handleLogout}
          onNavigateProperty={handlePropertyPress}
          onNavigateHome={() => go('home')}
        />
      )}

      {showDrawerButton ? (
        <DrawerMenu
          visible={drawerOpen}
          items={navItems}
          onClose={() => setDrawerOpen(false)}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogin={() => { setDrawerOpen(false); go('login'); }}
          onDashboard={() => { setDrawerOpen(false); go('dashboard'); }}
        />
      ) : null}
    </View>
  );
}

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [role, setRole] = useState<AuthRole>('public');

  return (
    <ThemeProvider initialMode={mode} initialRole={role}>
      <AppNavigator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
