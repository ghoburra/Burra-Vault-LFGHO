import { AssetCapsProvider } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { BorrowedPositionsListItem } from './BurraPositionsListItem';
import { BurraBorrowedPositionsListItem } from './BurraBorrowedPositionsListItem';

export const BorrowedPositionsListItemWrapper = ({ item }: { item: DashboardReserve }) => {
  const [displayGho] = useRootStore((store) => [store.displayGho]);
  const { currentMarket } = useProtocolDataContext();

  return (
    <AssetCapsProvider asset={item.reserve}>
     <BurraBorrowedPositionsListItem {...item} />
    </AssetCapsProvider>
  );
};
