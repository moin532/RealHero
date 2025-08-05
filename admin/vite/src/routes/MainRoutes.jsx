import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AddAdmin from './AddAdmin';
import AlllAdmins from './AlllAdmins';
import AddDriverSafety from './AddDriverSafety';
import { AddBusiness } from '@mui/icons-material';
import Business from './AddBuisness';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const AllDrivers = Loadable(lazy(() => import('../routes/AllDrivers')));
const DetailDriver = Loadable(lazy(() => import('../routes/DriverDetail')));
const DriverRequest = Loadable(lazy(() => import('../routes/DriverRequests')));
const DriversCaution = Loadable(lazy(() => import('../routes/DriversCaution')));
const DriverMapDashboard = Loadable(lazy(() => import('../routes/components/DriverMapDashboard')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'AllDrivers',
      element: <AllDrivers />
    },
    {
      path: 'DriverRequest',
      element: <DriverRequest />
    },
    {
      path: 'driver/detail/:id',
      element: <DetailDriver />
    },
    {
      path: '/add/admin',
      element: <AddAdmin />
    },
    {
      path: '/all/admin',
      element: <AlllAdmins />
    },
    {
      path: '/driver/safety',
      element: <DriversCaution />
    },
    {
      path: '/add/safety',
      element: <AddDriverSafety />
    },
    {
      path: '/add/business',
      element: <Business />
    },
    {
      path: '/driver/map',
      element: <DriverMapDashboard />
    }
    // {
    //   path: 'typography',
    //   element: <UtilsTypography />
    // },
    // {
    //   path: 'color',
    //   element: <UtilsColor />
    // },
    // {
    //   path: 'shadow',
    //   element: <UtilsShadow />
    // },
    // {
    //   path: '/sample-page',
    //   element: <SamplePage />
    // }
  ]
};

export default MainRoutes;
