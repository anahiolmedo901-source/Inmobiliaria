import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';

export type NavItem = {
  key: string;
  label: string;
  onPress: () => void;
  active?: boolean;
};

export function NavBar({
  items,
  isLoggedIn,
  userName,
  onLogin,
  onDashboard,
  onMenuToggle,
  showMenuButton,
}: {
  items: NavItem[];
  isLoggedIn?: boolean;
  userName?: string | null;
  onLogin?: () => void;
  onDashboard?: () => void;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}) {
  const { theme, mode, toggleTheme } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.surface + 'e6', borderBottomColor: theme.outlineVariant }]}>
      <View style={[styles.inner, { maxWidth: theme.spacing.containerMax }]}>
        <View style={styles.left}>
          <Pressable onPress={items[0]?.onPress} style={styles.brand}>
            <Text style={[styles.brandText, { color: theme.primary }]}>VIVIANA</Text>
          </Pressable>

          {isDesktop ? (
            <View style={styles.navItems}>
              {items.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={item.onPress}
                  style={({ pressed }) => [styles.navItem, pressed && { opacity: 0.8 }]}
                >
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: item.active ? theme.primary : theme.onSurfaceVariant,
                        borderBottomWidth: item.active ? 2 : 0,
                        borderBottomColor: theme.primary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.right}>
          <Pressable onPress={toggleTheme} style={styles.iconBtn}>
            <Ionicons
              name={mode === 'dark' ? 'sunny' : 'moon'}
              size={20}
              color={theme.onSurfaceVariant}
            />
          </Pressable>

          {isLoggedIn && userName ? (
            <Pressable
              onPress={onDashboard}
              style={({ pressed }) => [
                styles.loginBtn,
                {
                  backgroundColor: theme.primaryContainer,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Ionicons name="person" size={16} color={theme.onPrimaryContainer} />
              <Text style={[styles.loginText, { color: theme.onPrimaryContainer }]}>{userName}</Text>
            </Pressable>
          ) : null}

          {showMenuButton && !isDesktop ? (
            <Pressable onPress={onMenuToggle} style={styles.iconBtn}>
              <Ionicons name="menu" size={24} color={theme.onSurface} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    zIndex: 100,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 64,
    paddingVertical: 20,
    marginHorizontal: 'auto',
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  brand: {
    paddingVertical: 4,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Libre Caslon Text',
    letterSpacing: 1,
  },
  navItems: {
    flexDirection: 'row',
    gap: 32,
  },
  navItem: {
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    paddingBottom: 6,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 8,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
