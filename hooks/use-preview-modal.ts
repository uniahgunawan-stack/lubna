import { create } from 'zustand';
import { ProductWithDetails } from '@/actions/data';

interface PreviewModalStore {
  isOpen: boolean;
  data?: ProductWithDetails;
  onOpen: (data: ProductWithDetails) => void;
  onClose: () => void;
}

const usePreviewModal = create<PreviewModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: ProductWithDetails) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
