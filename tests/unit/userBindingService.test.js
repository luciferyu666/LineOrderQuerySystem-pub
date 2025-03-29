// tests/unit/userBindingService.test.js

import {
  getBindingByLineId,
  getBindingByContact,
  bindUser,
} from "../../../backend/services/userBindingService.js";

import * as bindingModel from "../../../backend/models/userBindingModel.js";

jest.mock("../../../backend/models/userBindingModel.js");

describe("🧪 userBindingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBindingByLineId()", () => {
    it("✅ 找到綁定資料時回傳聯絡資訊", async () => {
      bindingModel.findBindingByLineId.mockResolvedValue({
        line_id: "U1234567890",
        contact_info: "test@example.com",
      });

      const result = await getBindingByLineId("U1234567890");
      expect(result).toBe("test@example.com");
    });

    it("🟡 查無資料時回傳 null", async () => {
      bindingModel.findBindingByLineId.mockResolvedValue(null);

      const result = await getBindingByLineId("U9999999999");
      expect(result).toBeNull();
    });

    it("❌ 查詢失敗應拋出例外", async () => {
      bindingModel.findBindingByLineId.mockRejectedValue(new Error("DB error"));

      await expect(getBindingByLineId("U1")).rejects.toThrow("DB error");
    });
  });

  describe("getBindingByContact()", () => {
    it("✅ 找到綁定資料時回傳 LINE ID", async () => {
      bindingModel.findBindingByContact.mockResolvedValue({
        line_id: "U1234567890",
        contact_info: "test@example.com",
      });

      const result = await getBindingByContact("test@example.com");
      expect(result).toBe("U1234567890");
    });

    it("🟡 查無資料時回傳 null", async () => {
      bindingModel.findBindingByContact.mockResolvedValue(null);

      const result = await getBindingByContact("no-one@example.com");
      expect(result).toBeNull();
    });

    it("❌ 查詢失敗應拋出例外", async () => {
      bindingModel.findBindingByContact.mockRejectedValue(
        new Error("DB read error")
      );

      await expect(getBindingByContact("err@example.com")).rejects.toThrow(
        "DB read error"
      );
    });
  });

  describe("bindUser()", () => {
    it("✅ 建立綁定成功", async () => {
      bindingModel.createBinding.mockResolvedValue();

      const result = await bindUser("U1234567890", "test@example.com");
      expect(bindingModel.createBinding).toHaveBeenCalledWith(
        "U1234567890",
        "test@example.com"
      );
      expect(result).toBe(true);
    });

    it("❌ 綁定過程中發生錯誤應拋出例外", async () => {
      bindingModel.createBinding.mockRejectedValue(new Error("Insert failed"));

      await expect(bindUser("U1", "abc@example.com")).rejects.toThrow(
        "Insert failed"
      );
    });
  });
});
