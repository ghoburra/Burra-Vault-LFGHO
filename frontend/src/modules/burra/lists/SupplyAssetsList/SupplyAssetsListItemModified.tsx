import { ListItem } from "@mui/material";
import { ListColumn } from "src/components/lists/ListColumn";
import { Row } from "src/components/primitives/Row";
import { ListItemWrapper } from "../ListItemWrapper";


export const SupplyAssetsListItemModified = (props: {
  element: {
    owner: string,
    amount: number
  }
}) => {

  return (
      <ListItem>
        <ListColumn align="left">
          <b>Address:</b> 
          <br></br>
          {`${props.element.owner.substring(0, 4)}...${props.element.owner.substring(38)}`}
        </ListColumn>
        <ListColumn align="left">
         <b>APY:</b> 
          <br></br>
         1.15%
        </ListColumn >
        <></>
        <ListColumn align="left">
          <b>Amount:</b>
          <br></br>
           {props.element.amount}
        </ListColumn >
      </ListItem>
  );
};