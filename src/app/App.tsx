import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppColors } from './constants/colors';

export default function App() {
  return (
    <div style={{ backgroundColor: AppColors.forestDark, minHeight: '100dvh' }}>
      <div
        style={{
          maxWidth: '430px',
          height: '100dvh',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: AppColors.surfaceLight,
          display: 'flex',
          flexDirection: 'column' as const,
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
