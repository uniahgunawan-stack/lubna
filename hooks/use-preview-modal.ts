import { create } from 'zustand';
import { ProductTransformed } from '@/actions/data';

interface PreviewModalStore {
  isOpen: boolean;
  data?: ProductTransformed;
  onOpen: (data: ProductTransformed) => void;
  onClose: () => void;
}

const usePreviewModal = create<PreviewModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: ProductTransformed) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
