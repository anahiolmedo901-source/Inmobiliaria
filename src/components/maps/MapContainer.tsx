import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';

type MapContainerProps = {
  latitude: number;
  longitude: number;
  style?: any;
};

let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch {}
}

export function MapContainer({ latitude, longitude, style }: MapContainerProps) {
  const { theme } = useAppTheme();
  const [mapReady, setMapReady] = React.useState(false);

  if (Platform.OS !== 'web' && MapView) {
    return (
      <View style={[{ flex: 1 }, style]}>
        {!mapReady ? (
          <View style={styles.loading} pointerEvents="none">
            <Ionicons name="location" size={28} color={theme.onSurfaceVariant} />
            <Text style={[styles.loadingText, { color: theme.onSurfaceVariant }]}>
              Cargando mapa...
            </Text>
          </View>
        ) : null}
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: theme.surfaceContainerHighest }, style]}>
      <Image
        source={{
          uri: `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=300&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};color:%23c9a14a;size:medium&apiKey=GEOAPIFY_API_KEY`,
        }}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        resizeMode="cover"
      />
      <View style={styles.fallback}>
        <Ionicons name="location" size={32} color={theme.primary} />
        <Text style={[styles.fallbackText, { color: theme.onSurfaceVariant }]}>
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
        <Text style={[styles.fallbackSubtext, { color: theme.onSurfaceVariant }]}>
          México
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 2,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '800',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  fallbackText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fallbackSubtext: {
    fontSize: 11,
    fontWeight: '600',
  },
});
