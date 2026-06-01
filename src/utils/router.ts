import { useCallback, useEffect, useState } from 'react';

export type ScreenRoute =
  | 'home'
  | 'properties'
  | 'propertyDetail'
  | 'developments'
  | 'agents'
  | 'agentPortfolio'
  | 'contact'
  | 'login'
  | 'dashboard';

const SCREEN_PATH: Record<ScreenRoute, string> = {
  home: 'Inicio',
  properties: 'Propiedades',
  propertyDetail: 'Propiedad',
  developments: 'Desarrollos',
  agents: 'Agentes',
  agentPortfolio: 'Agente',
  contact: 'Contacto',
  login: 'Login',
  dashboard: 'Dashboard',
};

const PATH_TO_SCREEN: Record<string, ScreenRoute> = {};
for (const [key, val] of Object.entries(SCREEN_PATH)) {
  PATH_TO_SCREEN[val] = key as ScreenRoute;
}

export function useUrlRouter(initial: ScreenRoute = 'home') {
  const [route, setRoute] = useState<ScreenRoute>(() => {
    if (typeof window === 'undefined') return initial;
    const path = window.location.pathname.replace(/^\//, '');
    const base = path.split('/')[0];
    return (base && PATH_TO_SCREEN[base]) || initial;
  });

  const navigate = useCallback((target: ScreenRoute) => {
    setRoute(target);
    if (typeof window !== 'undefined') {
      const path = SCREEN_PATH[target];
      window.history.pushState({ route: target }, '', `/${path}`);
    }
  }, []);

  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const base = path.split('/')[0];
      if (base && PATH_TO_SCREEN[base]) {
        setRoute(PATH_TO_SCREEN[base]);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  return { route, navigate };
}
