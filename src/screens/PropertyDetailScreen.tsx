import React, { useCallback, useMemo } from 'react';
import { useAppTheme } from '../theme/ThemeContext';
import { PropertyDetailLayout } from '../components/properties/PropertyDetailLayout';
import type { Property } from '../data/types';
import type { PropertyDetailModel } from '../components/properties/PropertyDetailLayout';

export function PropertyDetailScreen({
  property,
  onBack,
}: {
  property: Property;
  onBack?: () => void;
}) {
  const { theme } = useAppTheme();

  const model = useMemo<PropertyDetailModel>(() => {
    return {
      id: property.id,
      title: property.title,
      images: property.images,
      location: property.location,
      description: property.description,
      features: property.features,
      agent: property.agent,
      breadcrumbs: [
        { label: 'Propiedades', onPress: onBack },
        { label: 'Detalle' },
      ],
    };
  }, [property, onBack]);

  return <PropertyDetailLayout property={model} onBack={onBack} />;
}
