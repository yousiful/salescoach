import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import SubscriptionModal from './SubscriptionModal';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { shouldShowPaymentWall } = useAppContext();
  const [showSubscriptionModal, setShowSubscriptionModal] = React.useState(false);

  React.useEffect(() => {
    if (shouldShowPaymentWall()) {
      setShowSubscriptionModal(true);
    }
  }, [shouldShowPaymentWall]);

  return (
    <>
      {children}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
}

export default PrivateRoute;