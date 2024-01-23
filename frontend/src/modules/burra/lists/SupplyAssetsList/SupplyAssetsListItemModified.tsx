import { Button, ListItem } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { Row } from 'src/components/primitives/Row';

import { ListItemWrapper } from '../ListItemWrapper';

export const SupplyAssetsListItemModified = (props: {
  element: {
    owner: string;
    amount: number;
  };
}) => {
  return (
    <ListItem>
      <ListColumn align="left">
        <b>Address:</b>
        <br />
        {`${props.element.owner.substring(0, 4)}...${props.element.owner.substring(38)}`}
      </ListColumn>
      <ListColumn align="left">
        <b>APY:</b>
        <br />
        1.15%
      </ListColumn>
      <></>
      <ListColumn align="left">
        <b>Amount:</b>
        <br />
        {props.element.amount}
      </ListColumn>
      <ListColumn align="left">
        <b>Buy Debt Position:</b>
        <br />
        <Button variant="outlined">Buy</Button>
      </ListColumn>
    </ListItem>
  );
};
