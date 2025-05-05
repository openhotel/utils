import { CompanyPermissions } from "../enums/company.enums.ts";

export const decodeContractPermissions = (permissions: number) => ({
  [CompanyPermissions.SPEND_CREDITS]: Boolean(permissions & (1 << 0)),
  [CompanyPermissions.BUY_FURNIS]: Boolean(permissions & (1 << 1)),
  [CompanyPermissions.SELL_FURNIS]: Boolean(permissions & (1 << 2)),
  [CompanyPermissions.MOVE_FURNIS]: Boolean(permissions & (1 << 3)),
  [CompanyPermissions.CREATE_ROOMS]: Boolean(permissions & (1 << 4)),
  [CompanyPermissions.DELETE_ROOMS]: Boolean(permissions & (1 << 5)),
});

export const encodeContractPermissions = (
  permissions: Record<CompanyPermissions, boolean>,
) => {
  let encoded = 0;

  if (permissions.canSpendCredits) encoded |= 1 << 0;
  if (permissions.canBuyFurnis) encoded |= 1 << 1;
  if (permissions.canSellFurnis) encoded |= 1 << 2;
  if (permissions.canMoveFurnis) encoded |= 1 << 3;
  if (permissions.canCreateRooms) encoded |= 1 << 4;
  if (permissions.canDeleteRooms) encoded |= 1 << 5;

  return encoded;
};
