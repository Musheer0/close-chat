import { create } from "zustand";

type ShareCardStore = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useShareCard = create<ShareCardStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
