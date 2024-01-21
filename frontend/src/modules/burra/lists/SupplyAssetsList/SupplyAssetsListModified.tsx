import { Trans } from '@lingui/macro';
import { ListItem, Typography } from '@mui/material';
import { useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';

import { ListWrapper } from '../../../../components/lists/ListWrapper';
import {
  DASHBOARD_LIST_COLUMN_WIDTHS,
} from '../../../../utils/dashboardSortUtils';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { useBurra } from 'src/hooks/burra/useBurra';
import { SupplyAssetsListItemModified, SupplyAssetsListItemModifiedGeneral } from './SupplyAssetsListItemModified';
import { Row } from 'src/components/primitives/Row';
import { ListValueRow } from 'src/modules/dashboard/lists/ListValueRow';

const head = [
  { title: <Trans key="assets">Owner</Trans>, sortKey: 'symbol' },
  { title: <Trans key="APY">APY</Trans>, sortKey: 'supplyAPY' },
  { title: <Trans key="APY">Amount Available</Trans>, sortKey: 'amount' },
  { title: <Trans key="APY">Actions</Trans>, sortKey: 'actions' },
];

export const SupplyAssetsListModified = () => {

  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const { listedBurraPerUser } = useBurra()







  return (
    <ListWrapper
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>Burra Debt Securities</Trans>
        </Typography>
      }
      localStorageName="supplyAssetsDashboardTableCollapse"
      withTopMargin
      noData={false}
      subChildrenComponent={<></>
      }
    >
      <>

        {listedBurraPerUser?.map((el: any, index: any) => <SupplyAssetsListItemModified element={el} key={index} />
        )}
      </>
    </ListWrapper>
  );

};
