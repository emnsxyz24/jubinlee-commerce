import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export const useToastStore = defineStore('toast', () => {
  const show = (message: string, type: ToastType = 'success', title?: string, duration: number = 3800) => {
    const opts = { description: message, duration };
    if (type === 'error') {
      toast.error(title || 'Action Failed', opts);
    } else if (type === 'warning') {
      toast.warning(title || 'Attention', opts);
    } else if (type === 'info') {
      toast.info(title || 'Notification', opts);
    } else {
      toast.success(title || 'Success', opts);
    }
  };

  const success = (message: string, title: string = 'Success') => show(message, 'success', title);
  const error = (message: string, title: string = 'Action Failed') => show(message, 'error', title);
  const warning = (message: string, title: string = 'Attention') => show(message, 'warning', title);
  const info = (message: string, title: string = 'Notification') => show(message, 'info', title);
  const remove = (_id?: string) => toast.dismiss();

  return {
    toasts: [],
    show,
    success,
    error,
    warning,
    info,
    remove,
  };
});
