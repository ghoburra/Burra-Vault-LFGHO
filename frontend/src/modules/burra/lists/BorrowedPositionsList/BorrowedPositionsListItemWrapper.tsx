import { GhoBorrowedPositionsListItem } from './GhoBorrowedPositionsListItem';

export const BorrowedPositionsListItemWrapper = ({ item }: { item: any }) => {
  return (
    // <AssetCapsProvider asset={null}>
    <GhoBorrowedPositionsListItem {...item} />
    // </AssetCapsProvider>
  );
};
