import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import type { Property } from '../../data/types';

const FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function HeroCarousel({
  properties,
  onPropertyPress,
}: {
  properties: Property[];
  onPropertyPress?: (property: Property) => void;
}) {
  const { theme } = useAppTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(idx);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {properties.map((property) => (
          <Pressable
            key={property.id}
            style={[styles.slide, { width: SCREEN_WIDTH }]}
            onPress={() => onPropertyPress?.(property)}
          >
            <Image source={{ uri: property.images[0] }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
              <View style={styles.slideContent}>
                <Text style={styles.slideBadge}>COLECCIÓN DESTACADA</Text>
                <Text style={styles.slideTitle}>{property.title}</Text>
                <Text style={styles.slideSubtitle}>{property.location.label}</Text>
                <Text style={styles.slidePrice}>{FORMATTER.format(property.price)} MXN</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {properties.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              {
                backgroundColor: idx === activeIndex ? theme.primary : theme.outlineVariant,
                width: idx === activeIndex ? 28 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.arrows}>
        <Pressable
          onPress={() => {
            const prev = Math.max(0, activeIndex - 1);
            setActiveIndex(prev);
            scrollRef.current?.scrollTo({ x: prev * SCREEN_WIDTH, animated: true });
          }}
          style={[styles.arrowBtn, { backgroundColor: theme.surface + 'cc' }]}
        >
          <Ionicons name="chevron-back" size={24} color={theme.onSurface} />
        </Pressable>
        <Pressable
          onPress={() => {
            const next = Math.min(properties.length - 1, activeIndex + 1);
            setActiveIndex(next);
            scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
          }}
          style={[styles.arrowBtn, { backgroundColor: theme.surface + 'cc' }]}
        >
          <Ionicons name="chevron-forward" size={24} color={theme.onSurface} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', height: 700 },
  slide: { height: 700 },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end', paddingBottom: 120, paddingHorizontal: 64 },
  slideContent: { maxWidth: 600, gap: 8 },
  slideBadge: { color: '#ecc166', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  slideTitle: { color: '#ffffff', fontSize: 48, fontWeight: '400', fontFamily: 'Libre Caslon Text', lineHeight: 56 },
  slideSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 18, lineHeight: 28 },
  slidePrice: { color: '#ecc166', fontSize: 24, fontWeight: '700', marginTop: 8 },
  dots: { position: 'absolute', bottom: 60, left: 64, flexDirection: 'row', gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  arrows: { position: 'absolute', right: 64, bottom: 56, flexDirection: 'row', gap: 8 },
  arrowBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
