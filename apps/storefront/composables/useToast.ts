import { h } from 'vue';
import { toast, type ExternalToast } from 'vue-sonner';

export interface ToastMessage {
  id?: string;
  title: string;
  message?: string;
  imageUrl?: string;
  type?: 'success' | 'info' | 'error' | 'warning';
  duration?: number;
  position?: ExternalToast['position'];
}

export const useToast = () => {
  const addToast = (t: ToastMessage) => {
    const desc = t.message;
    const opts: ExternalToast = {
      description: desc,
      duration: t.duration || 4000,
      ...(t.position ? { position: t.position } : {}),
    };
    if (t.type === 'error') {
      toast.error(t.title, opts);
    } else if (t.type === 'warning') {
      toast.warning(t.title, opts);
    } else if (t.type === 'info') {
      toast.info(t.title, opts);
    } else {
      toast.success(t.title, opts);
    }
  };

  const success = (title: string, message?: string, position?: ExternalToast['position']) => {
    toast.success(title, {
      description: message,
      duration: 3800,
      ...(position ? { position } : {}),
    });
  };

  const error = (title: string, message?: string, position?: ExternalToast['position']) => {
    toast.error(title, {
      description: message,
      duration: 4200,
      ...(position ? { position } : {}),
    });
  };

  const warning = (title: string, message?: string, position?: ExternalToast['position']) => {
    toast.warning(title, {
      description: message,
      duration: 4000,
      ...(position ? { position } : {}),
    });
  };

  const info = (title: string, message?: string, position?: ExternalToast['position']) => {
    toast.info(title, {
      description: message,
      duration: 3800,
      ...(position ? { position } : {}),
    });
  };

  const removeToast = (_id?: string) => {
    toast.dismiss();
  };

  const showAddedToCart = (productName: string, variantDetails?: string, imageUrl?: string) => {
    if (imageUrl) {
      toast.custom(
        () =>
          h(
            'div',
            {
              class: 'w-full flex items-center gap-3.5',
            },
            [
              h('img', {
                src: imageUrl,
                alt: productName,
                class:
                  'w-12 h-14 object-cover rounded-xl bg-[#F4ECE5] border border-[#E4D8CC] shrink-0 shadow-2xs',
              }),
              h('div', { class: 'flex-1 min-w-0 flex flex-col gap-0.5' }, [
                h('div', { class: 'flex items-center gap-2' }, [
                  h('span', {
                    class:
                      'inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0',
                  }),
                  h(
                    'span',
                    {
                      class:
                        'font-extrabold text-[15px] text-[#1A170F] tracking-tight leading-snug',
                    },
                    'Added to Bag',
                  ),
                ]),
                h(
                  'p',
                  {
                    class:
                      'text-sm text-[#1A170F] font-bold truncate leading-snug mt-0.5',
                  },
                  productName,
                ),
                variantDetails
                  ? h(
                      'p',
                      {
                        class:
                          'text-xs text-[#7D766E] font-medium leading-tight',
                      },
                      variantDetails,
                    )
                  : null,
              ]),
            ],
          ),
        { duration: 3800 },
      );
    } else {
      toast.success('Added to Bag', {
        description: `${productName}${variantDetails ? ` (${variantDetails})` : ''}`,
        duration: 3800,
      });
    }
  };

  return {
    toasts: [],
    addToast,
    success,
    error,
    warning,
    info,
    removeToast,
    showAddedToCart,
    toast,
  };
};
