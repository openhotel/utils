import { describe, it, expect } from "@jest/globals";
import { CompanyPermissions } from "../../enums/company.enums.ts";
import {
  decodeContractPermissions,
  encodeContractPermissions,
} from "../company.utils.ts";

describe("utils", () => {
  describe("company", () => {
    const allTrue = {
      [CompanyPermissions.SPEND_CREDITS]: true,
      [CompanyPermissions.BUY_FURNIS]: true,
      [CompanyPermissions.SELL_FURNIS]: true,
      [CompanyPermissions.MOVE_FURNIS]: true,
      [CompanyPermissions.CREATE_ROOMS]: true,
      [CompanyPermissions.DELETE_ROOMS]: true,
    };

    const allFalse = {
      [CompanyPermissions.SPEND_CREDITS]: false,
      [CompanyPermissions.BUY_FURNIS]: false,
      [CompanyPermissions.SELL_FURNIS]: false,
      [CompanyPermissions.MOVE_FURNIS]: false,
      [CompanyPermissions.CREATE_ROOMS]: false,
      [CompanyPermissions.DELETE_ROOMS]: false,
    };

    describe("encode/decode contract permissions", () => {
      it("with all permissions true", () => {
        const encoded = encodeContractPermissions(allTrue);
        expect(encoded).toBe(0b111111); // 63
      });

      it("with all permissions false", () => {
        const encoded = encodeContractPermissions(allFalse);
        expect(encoded).toBe(0); // 0
      });

      it("decodeContractPermissions for encoded 63 returns all true", () => {
        const decoded = decodeContractPermissions(63);
        expect(decoded).toEqual(allTrue);
      });

      it("decodeContractPermissions for encoded 0 returns all false", () => {
        const decoded = decodeContractPermissions(0);
        expect(decoded).toEqual(allFalse);
      });

      it("encode and decode consistency", () => {
        const original = {
          [CompanyPermissions.SPEND_CREDITS]: true,
          [CompanyPermissions.BUY_FURNIS]: false,
          [CompanyPermissions.SELL_FURNIS]: true,
          [CompanyPermissions.MOVE_FURNIS]: false,
          [CompanyPermissions.CREATE_ROOMS]: true,
          [CompanyPermissions.DELETE_ROOMS]: false,
        };
        const encoded = encodeContractPermissions(original);
        const decoded = decodeContractPermissions(encoded);
        expect(decoded).toEqual(original);
      });

      it("bit order of CompanyPermissions enum must match bit position", () => {
        const expectedOrder = [
          "canSpendCredits",
          "canBuyFurnis",
          "canSellFurnis",
          "canMoveFurnis",
          "canCreateRooms",
          "canDeleteRooms",
        ];

        const enumOrder = Object.values(CompanyPermissions);
        expect(enumOrder).toEqual(expectedOrder);
      });
    });
  });
});
