import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { UserProvider } from 'contexts/UserContext';

import ThemeCustomization from 'themes';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <UserProvider>
        <NavigationScroll>
          <>
            <RouterProvider router={router} />
          </>
        </NavigationScroll>
      </UserProvider>
    </ThemeCustomization>
  );
}
