import '@testing-library/jest-dom';
import 'jest-canvas-mock';

global.L = {
  map: jest.fn().mockReturnValue({}),
  tileLayer: jest.fn().mockReturnValue({}),
  marker: jest.fn().mockReturnValue({}),
  latLng: jest.fn(),
  latLngBounds: jest.fn(),
  Routing: {
    control: jest.fn(() => ({
      addTo: jest.fn(),
      getPlan: jest.fn(() => ({
        setWaypoints: jest.fn(),
      })),
    })),
    osrmv1: jest.fn(),
  },
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
  divIcon: jest.fn(() => ({})),
};

jest.mock('leaflet', () => global.L);

jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(({ children }) => <div>{children}</div>),
  TileLayer: jest.fn(),
  Marker: jest.fn(),
  Tooltip: jest.fn(),
  useMap: jest.fn(() => ({
    fitBounds: jest.fn(),
    eachLayer: jest.fn(),
    removeLayer: jest.fn(),
  })),
}));

jest.mock('leaflet-routing-machine', () => ({
  addTo: jest.fn(),
  getPlan: jest.fn(() => ({
    setWaypoints: jest.fn(),
  })),
  control: jest.fn(() => ({
    addTo: jest.fn(),
    getPlan: jest.fn(() => ({
      setWaypoints: jest.fn(),
    })),
  })),
}));

global.alert = jest.fn();
