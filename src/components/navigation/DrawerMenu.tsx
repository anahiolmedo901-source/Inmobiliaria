import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import type { NavItem } from './NavBar';

export function DrawerMenu({
  visible,
  items,
  onClose,
  isLoggedIn,
  userName,
  onLogin,
  onDashboard,
}: {
  visible: boolean;
  items: NavItem[];
  onClose: () => void;
  isLoggedIn?: boolean;
  userName?: string | null;
  onLogin?: () => void;
  onDashboard?: () => void;
}) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : -280,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible, slideAnim, overlayAnim]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[styles.overlay, { opacity: overlayAnim }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: theme.surface,
            borderRightColor: theme.outlineVariant,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={[styles.drawerBrand, { color: theme.primary }]}>VIVIANA</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={theme.onSurface} />
          </Pressable>
        </View>

        {isLoggedIn && userName ? (
          <Pressable
            onPress={() => { onClose(); onDashboard?.(); }}
            style={({ pressed }) => [
              styles.loginBtn,
              { backgroundColor: theme.primaryContainer, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Ionicons name="person" size={18} color={theme.onPrimaryContainer} />
            <Text style={[styles.loginText, { color: theme.onPrimaryContainer }]}>{userName}</Text>
          </Pressable>
        ) : null}

        <View style={styles.navList}>
          {items.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => { onClose(); item.onPress(); }}
              style={({ pressed }) => [
                styles.navItem,
                {
                  backgroundColor: item.active ? theme.primaryContainer + '30' : 'transparent',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.navLabel, { color: item.active ? theme.primary : theme.onSurface }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 200,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    zIndex: 300,
    borderRightWidth: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    gap: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerBrand: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Libre Caslon Text',
  },
  closeBtn: {
    padding: 4,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '700',
  },
  navList: {
    gap: 4,
  },
  navItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
