<template>
  <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 flex-1 min-h-screen">
    
    <ProductDetailSkeleton v-if="loading" />

    <div v-else-if="!product" class="py-20 text-center">
      <h1 class="font-serif text-2xl font-black text-[#1A170F]">Product Not Found</h1>
      <NuxtLink to="/products" class="mt-4 inline-block px-6 py-3 rounded-2xl bg-[#E04F26] text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-md">
        Return to Catalog
      </NuxtLink>
    </div>

    <div v-else class="space-y-16">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        <div class="space-y-3">
          
          <div 
            @click="isLightboxOpen = true"
            class="max-h-110 sm:max-h-[480px] lg:max-h-[500px] aspect-4/5 w-full rounded-3xl overflow-hidden bg-[#FAF6F1] border border-[#E4D8CC] shadow-md relative group cursor-zoom-in"
            title="Click to view full image & zoom"
          >
            <img 
              :src="activeMainImage" 
              :alt="product.name" 
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />

            <span 
              v-if="selectedVariant && selectedVariant.stockQuantity <= 0"
              class="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md"
            >
              Out of Stock
            </span>
            <span 
              v-else-if="selectedVariant && selectedVariant.stockQuantity < 5"
              class="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md"
            >
              Only {{ selectedVariant.stockQuantity }} Left
            </span>
          </div>

          <div v-if="allImages.length > 0" class="flex space-x-3 overflow-x-auto pb-1 pt-1 shrink-0">
            <button 
              v-for="(img, idx) in allImages" 
              :key="img.id || img.url || idx"
              @click="handleSelectGalleryImage(img.url)"
              :class="[
                activeMainImage === img.url 
                  ? 'ring-2 ring-[#1A170F] scale-95 opacity-100 border-transparent shadow-md' 
                  : 'opacity-65 hover:opacity-100 hover:scale-105 border-[#E4D8CC]'
              ]"
              class="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF6F1] shrink-0 border transition-all duration-200 cursor-pointer"
            >
              <img :src="img.url" :alt="img.altText || product.name" loading="lazy" decoding="async" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div class="space-y-6 sm:space-y-8">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#E04F26] font-bold">
              {{ product.category?.name || 'Apparel' }}
            </span>
            <h1 class="font-serif text-3xl sm:text-4xl font-black text-[#1A170F] mt-1">
              {{ product.name }}
            </h1>
            <p class="text-2xl font-extrabold text-[#1A170F] mt-3 tnum">
              Rp{{ formatPrice(currentPrice) }}
            </p>
          </div>

          <div v-if="availableColors.length">
            <label class="block text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-2">
              Color: 
              <span v-if="selectedColor" class="text-[#E04F26] font-extrabold">{{ selectedColor }}</span>
              <span v-else class="text-[#7D766E] font-normal lowercase tracking-normal">(choose a color)</span>
            </label>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="color in availableColors" 
                :key="color.name"
                @click="selectColor(color)"
                :class="[selectedColor === color.name ? 'pill-flat-selected' : 'pill-flat']"
                class="px-4 py-2 text-xs transition cursor-pointer font-medium flex items-center gap-2"
              >
                <span 
                  v-if="color.colorHex" 
                  class="w-3 h-3 rounded-full border border-black/10 shrink-0" 
                  :style="{ backgroundColor: color.colorHex }"
                />
                <span>{{ color.name }}</span>
              </button>
            </div>
          </div>

          <div v-if="availableSizes.length">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#1A3D63]">
                Size: 
                <span v-if="selectedSize" class="text-[#E04F26] font-bold">{{ selectedSize }}</span>
                <span v-else class="text-[#7D766E] font-normal lowercase tracking-normal">(choose a size)</span>
              </label>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="sizeObj in availableSizes" 
                :key="sizeObj.size"
                @click="selectSize(sizeObj.size)"
                :disabled="sizeObj.stockQuantity <= 0"
                :class="[
                  selectedSize === sizeObj.size ? 'pill-flat-selected' : 'pill-flat',
                  sizeObj.stockQuantity <= 0 ? 'opacity-35 cursor-not-allowed text-[#7D766E]' : 'cursor-pointer'
                ]"
                class="px-4 py-2.5 text-xs transition min-w-[50px] text-center font-medium"
              >
                {{ sizeObj.size }}
              </button>
            </div>
          </div>

          <div v-if="customVariantGroup" class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-2">
              {{ customVariantGroup.name }}: 
              <span v-if="selectedCustomOption" class="text-[#E04F26] font-extrabold">{{ selectedCustomOption }}</span>
              <span v-else class="text-[#7D766E] font-normal lowercase tracking-normal">(choose an option)</span>
            </label>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="opt in customVariantGroup.options" 
                :key="opt.name"
                @click="selectCustomOption(opt)"
                :class="[selectedCustomOption === opt.name ? 'pill-flat-selected' : 'pill-flat']"
                class="px-4 py-2 text-xs transition cursor-pointer font-medium"
              >
                {{ opt.name }}
              </button>
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t border-[#E4D8CC]">
            <div class="flex items-center space-x-4">
              <label class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Quantity</label>
              <div class="flex items-center space-x-2">
                <button 
                  @click="quantity > 1 && quantity--" 
                  :disabled="quantity <= 1"
                  class="w-9 h-9 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] flex items-center justify-center text-sm font-bold text-[#1A170F] disabled:opacity-30 cursor-pointer hover:bg-[#F4ECE5]"
                >
                  -
                </button>
                <span class="w-10 text-center font-bold text-sm text-[#1A170F]">{{ quantity }}</span>
                <button 
                  @click="quantity < (selectedVariant?.stockQuantity || 1) && quantity++" 
                  :disabled="!selectedVariant || quantity >= selectedVariant.stockQuantity"
                  class="w-9 h-9 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] flex items-center justify-center text-sm font-bold text-[#1A170F] disabled:opacity-30 cursor-pointer hover:bg-[#F4ECE5]"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              @click="handleAddToCart"
              :disabled="isAddToCartDisabled"
              :class="[
                isAddToCartDisabled 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                  : 'bg-[#E04F26] hover:bg-[#C8431E] text-white shadow-xl cursor-pointer'
              ]"
              class="w-full py-4 rounded-2xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <span>{{ addToCartButtonLabel }}</span>
            </button>
          </div>

          <div class="pt-6 border-t border-[#B3CFE5]/50 space-y-4">
            <details class="group">
              <summary class="flex justify-between items-center font-serif font-bold text-[#0A1931] cursor-pointer list-none text-sm">
                <span>Description & Fabric Care</span>
                <span class="transition group-open:rotate-180">↓</span>
              </summary>
              <p class="mt-3 text-xs leading-relaxed text-[#1A3D63] font-light">
                {{ product.description || 'Handcrafted premium apparel crafted with precision tailoring and sustainable fabric selection.' }}
              </p>
            </details>

            <details class="group">
              <summary class="flex justify-between items-center font-serif font-bold text-[#0A1931] cursor-pointer list-none text-sm">
                <span>WhatsApp Ordering & Shipping</span>
                <span class="transition group-open:rotate-180">↓</span>
              </summary>
              <p class="mt-3 text-xs leading-relaxed text-[#1A3D63] font-light">
                Orders are generated instantly and handed off to WhatsApp. Shipping costs and delivery estimates are confirmed directly with our team.
              </p>
            </details>
          </div>

        </div>

      </div>

      <section v-if="relatedProducts.length" class="pt-12 border-t border-[#B3CFE5]/50 space-y-6">
        <div class="flex justify-between items-end">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#4A7FA7] font-semibold">Curated Recommendations</span>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#0A1931] mt-1">You May Also Like</h2>
          </div>
          <NuxtLink to="/products" class="text-xs font-semibold text-[#4A7FA7] hover:text-[#0A1931] transition cursor-pointer">
            Explore All Catalog →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div 
            v-for="rel in relatedProducts" 
            :key="rel.id"
            :class="[
              isProductInStock(rel) 
                ? 'bg-[#FAF6F1] text-[#1A170F]' 
                : 'bg-[#FAF6F1]/80 text-[#1A170F]/70 border-[#E4D8CC]/80'
            ]"
            class="group rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4D8CC] hover:border-[#E04F26] flex flex-col justify-between overflow-hidden cursor-pointer"
            @click="navigateToProduct(rel.slug)"
          >
            <div class="relative w-full aspect-4/5 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 min-h-0 transition-all duration-300 ease-in-out">
              <img 
                :src="rel.productImages?.[0]?.url || 'https://via.placeholder.com/400x500'" 
                :alt="rel.name" 
                loading="lazy"
                decoding="async"
                :class="[
                  isProductInStock(rel) 
                    ? 'opacity-100 group-hover:scale-105' 
                    : 'opacity-60 grayscale-[35%] group-hover:scale-105'
                ]"
                class="w-full h-full object-cover object-top transition-all duration-500" 
              />

              <span 
                v-if="!isProductInStock(rel)"
                class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#1A170F]/80 backdrop-blur-xs text-white text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md z-10"
              >
                OUT OF STOCK
              </span>
              <span 
                v-else
                class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#1A170F] text-white text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md z-10"
              >
                {{ rel.category?.name || 'Apparel' }}
              </span>
            </div>

            <div class="px-1 pt-2 sm:pt-3">
              <h3 
                :class="[isProductInStock(rel) ? 'text-[#1A170F] group-hover:text-[#E04F26]' : 'text-[#1A170F]/60']"
                class="font-serif font-bold text-xs sm:text-base transition leading-snug line-clamp-1"
              >
                {{ rel.name }}
              </h3>
              <p 
                :class="[isProductInStock(rel) ? 'text-[#1A170F]' : 'text-[#1A170F]/60']"
                class="text-xs sm:text-base font-extrabold mt-0.5 sm:mt-1 tnum"
              >
                Rp{{ formatPrice(rel.basePrice) }}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>

    <ProductLightbox
      :is-open="isLightboxOpen"
      :images="allImages"
      :selected-index="lightboxIndex"
      :product-name="product?.name"
      @close="isLightboxOpen = false"
      @select="handleLightboxSelect"
    />

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import ProductLightbox from '~/components/ProductLightbox.vue';

const route = useRoute();
const cartStore = useCartStore();
const { fetchApi } = useApi();

const product = ref<any>(null);

useSeoMeta({
  title: computed(() => product.value ? `${product.value.name} — Jubi & Lee Studio` : 'Product Details — Jubi & Lee Studio'),
  description: computed(() => product.value?.description || 'Discover luxury apparel and modern wardrobe essentials at Jubi & Lee Studio.'),
  ogTitle: computed(() => product.value ? `${product.value.name} — Jubi & Lee Studio` : 'Product Details — Jubi & Lee Studio'),
  ogDescription: computed(() => product.value?.description || 'Discover luxury apparel at Jubi & Lee Studio.'),
  ogImage: computed(() => product.value?.productImages?.[0]?.url || ''),
});

const relatedProducts = ref<any[]>([]);
const loading = ref(true);
const adding = ref(false);

const isProductInStock = (prod: any) => {
  const variants = prod?.productVariants || prod?.variants || [];
  if (!variants.length) return true;
  return variants.some((v: any) => (v.stockQuantity || 0) > 0 && v.isActive !== false);
};

const sortInStockFirst = (items: any[]) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const aStock = isProductInStock(a) ? 1 : 0;
    const bStock = isProductInStock(b) ? 1 : 0;
    return bStock - aStock;
  });
};

const isLightboxOpen = ref(false);

const selectedVariantImage = ref<string>('');
const selectedGalleryImage = ref<string>('');
const selectedColor = ref<string>('');
const selectedSize = ref<string>('');
const selectedCustomOption = ref<string>('');
const selectedVariant = ref<any>(null);
const quantity = ref<number>(1);

const navigateToProduct = (slug: string) => {
  navigateTo(`/products/${slug}`);
};

const variantConfig = computed(() => {
  return product.value?.attributes?.variantConfig || null;
});

const allImages = computed(() => {
  if (!product.value) return [];
  const list: Array<{ url: string; altText?: string; id?: string }> = [];
  const seenUrls = new Set<string>();

  if (Array.isArray(product.value.productImages)) {
    const sorted = [...product.value.productImages].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    for (const img of sorted) {
      if (img?.url && !seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        list.push({ url: img.url, altText: img.altText || product.value.name, id: img.id });
      }
    }
  }

  const vConf = variantConfig.value;
  if (vConf?.defaultVariantEnabled && Array.isArray(vConf.colors)) {
    for (const c of vConf.colors) {
      if (c?.imageUrl && !seenUrls.has(c.imageUrl)) {
        seenUrls.add(c.imageUrl);
        list.push({ url: c.imageUrl, altText: `${product.value.name} - ${c.name}` });
      }
    }
  }

  if (vConf?.customVariantEnabled) {
    const cGroup = vConf.customVariant || vConf.customVariants?.[0];
    if (Array.isArray(cGroup?.options)) {
      for (const opt of cGroup.options) {
        if (opt?.imageUrl && !seenUrls.has(opt.imageUrl)) {
          seenUrls.add(opt.imageUrl);
          list.push({ url: opt.imageUrl, altText: `${product.value.name} - ${opt.name}` });
        }
      }
    }
  }

  if (Array.isArray(product.value.productVariants)) {
    for (const v of product.value.productVariants) {
      if (v?.imageUrl && !seenUrls.has(v.imageUrl)) {
        seenUrls.add(v.imageUrl);
        list.push({ url: v.imageUrl, altText: `${product.value.name} - ${v.color || v.size || ''}` });
      }
    }
  }

  return list;
});

const activeMainImage = computed(() => {
  if (selectedVariantImage.value) return selectedVariantImage.value;
  if (selectedGalleryImage.value) return selectedGalleryImage.value;
  const primaryImg = product.value?.productImages?.find((img: any) => img.isPrimary) || product.value?.productImages?.[0];
  if (primaryImg?.url) return primaryImg.url;
  if (allImages.value[0]?.url) return allImages.value[0].url;
  return 'https://via.placeholder.com/600x800';
});

const lightboxIndex = computed(() => {
  if (!allImages.value.length) return 0;
  const idx = allImages.value.findIndex((img: any) => img.url === activeMainImage.value);
  return idx >= 0 ? idx : 0;
});

const handleLightboxSelect = (idx: number) => {
  if (allImages.value[idx]?.url) {
    handleSelectGalleryImage(allImages.value[idx].url);
  }
};

const handleSelectGalleryImage = (url: string) => {
  selectedGalleryImage.value = url;
  selectedVariantImage.value = '';
};

const availableColors = computed(() => {
  if (variantConfig.value?.defaultVariantEnabled && Array.isArray(variantConfig.value.colors) && variantConfig.value.colors.length > 0) {
    return variantConfig.value.colors.map((c: any) => ({
      name: c.name,
      colorHex: c.colorHex,
      imageUrl: c.imageUrl,
    }));
  }

  if (!product.value?.productVariants) return [];
  const colorMap = new Map<string, any>();
  for (const v of product.value.productVariants) {
    if (v.color && v.color !== 'Standard' && !colorMap.has(v.color)) {
      colorMap.set(v.color, { name: v.color, colorHex: v.colorHex, imageUrl: '' });
    }
  }
  return Array.from(colorMap.values());
});

const filteredVariants = computed(() => {
  if (!product.value?.productVariants) return [];
  if (!selectedColor.value) return product.value.productVariants;
  return product.value.productVariants.filter((v: any) => v.color === selectedColor.value);
});

const availableSizes = computed(() => {
  const currentVariants = filteredVariants.value;
  if (!currentVariants.length) return [];

  const hasAnySize = currentVariants.some((v: any) => Boolean(v.size));
  if (!hasAnySize) {
    return [];
  }

  const vConf = variantConfig.value;
  const sizeKeys = vConf?.sizeType === 'numeric' && Array.isArray(vConf.numericSizes) && vConf.numericSizes.length > 0
    ? vConf.numericSizes
    : ['S', 'M', 'L', 'XL', 'XXL'];

  const foundSizes: Array<{ size: string; stockQuantity: number; variant: any }> = [];

  for (const sz of sizeKeys) {
    const matched = currentVariants.find((v: any) => v.size === sz);
    if (matched) {
      foundSizes.push({
        size: sz,
        stockQuantity: Number(matched.stockQuantity) || 0,
        variant: matched,
      });
    }
  }

  if (!foundSizes.length) {
    for (const v of currentVariants) {
      if (v.size) {
        foundSizes.push({
          size: v.size,
          stockQuantity: Number(v.stockQuantity) || 0,
          variant: v,
        });
      }
    }
  }

  return foundSizes;
});

const customVariantGroup = computed(() => {
  const vConf = variantConfig.value;
  if (vConf?.customVariantEnabled) {
    if (vConf.customVariant?.name && Array.isArray(vConf.customVariant.options) && vConf.customVariant.options.length > 0) {
      return vConf.customVariant;
    }
    if (Array.isArray(vConf.customVariants) && vConf.customVariants[0]?.name) {
      return vConf.customVariants[0];
    }
  }
  return null;
});

const currentPrice = computed(() => {
  if (selectedVariant.value?.priceOverride) return selectedVariant.value.priceOverride;
  return product.value?.basePrice || 0;
});

const isSelectionComplete = computed(() => {
  if (availableColors.value.length > 0 && !selectedColor.value) return false;
  if (availableSizes.value.length > 0 && !selectedSize.value) return false;
  if (customVariantGroup.value && !selectedCustomOption.value) return false;
  return Boolean(selectedVariant.value);
});

const addToCartButtonLabel = computed(() => {
  if (adding.value) return 'ADDING TO CART...';
  if (availableColors.value.length > 0 && !selectedColor.value) return 'SELECT COLOR';
  if (availableSizes.value.length > 0 && !selectedSize.value) return 'SELECT SIZE';
  if (customVariantGroup.value && !selectedCustomOption.value) return `SELECT ${customVariantGroup.value.name.toUpperCase()}`;
  if (!selectedVariant.value || selectedVariant.value.stockQuantity <= 0) return 'OUT OF STOCK';
  return '+ ADD TO CART';
});

const isAddToCartDisabled = computed(() => {
  if (adding.value) return true;
  if (!isSelectionComplete.value) return true;
  return !selectedVariant.value || selectedVariant.value.stockQuantity <= 0;
});

const selectColor = (colorObj: any) => {
  selectedColor.value = colorObj.name;
  if (colorObj.imageUrl) {
    selectedVariantImage.value = colorObj.imageUrl;
  }

  if (availableSizes.value.length > 0) {
    if (selectedSize.value) {
      const matched = filteredVariants.value.find((v: any) => v.size === selectedSize.value);
      if (matched) {
        selectedVariant.value = matched;
        quantity.value = Math.min(quantity.value, Math.max(1, matched.stockQuantity || 1));
      } else {
        selectedSize.value = '';
        selectedVariant.value = null;
        quantity.value = 1;
      }
    } else {
      selectedVariant.value = null;
      quantity.value = 1;
    }
  } else {
    selectedVariant.value = filteredVariants.value[0] || null;
    quantity.value = 1;
  }
};

const selectSize = (sz: string) => {
  selectedSize.value = sz;
  const matched = filteredVariants.value.find((v: any) => v.size === sz);
  selectedVariant.value = matched || null;
  quantity.value = 1;
};

const selectCustomOption = (opt: any) => {
  selectedCustomOption.value = opt.name;
  if (opt.imageUrl) {
    selectedVariantImage.value = opt.imageUrl;
  }
};

const toast = useToast();

const handleAddToCart = async () => {
  if (!selectedVariant.value) return;
  try {
    adding.value = true;
    const added = await cartStore.addItem(selectedVariant.value.id, quantity.value);

    if (added) {
      const parts = [];
      if (selectedColor.value && selectedColor.value !== 'Standard') parts.push(selectedColor.value);
      if (selectedVariant.value.size) parts.push(selectedVariant.value.size);
      if (selectedCustomOption.value) parts.push(selectedCustomOption.value);
      const variantDesc = parts.join(' / ');

      toast.showAddedToCart(
        product.value?.name || 'Item',
        variantDesc,
        activeMainImage.value
      );
    }
  } catch (e: any) {
    toast.error('Unable to Add to Bag', e?.data?.message || e?.message || 'Failed to add item to cart');
  } finally {
    adding.value = false;
  }
};

const fetchProductData = async () => {
  const slug = route.params.slug as string;
  if (!slug) return;

  try {
    loading.value = true;
    const [pData, relData] = await Promise.all([
      fetchApi<any>(`/products/${slug}`),
      fetchApi<any[]>(`/products/${slug}/related`).catch(() => []),
    ]);

    product.value = pData;
    relatedProducts.value = sortInStockFirst(relData || []);

    if (pData?.productImages?.length) {
      const primaryImg = pData.productImages.find((img: any) => img.isPrimary) || pData.productImages[0];
      selectedGalleryImage.value = primaryImg.url;
    }
    selectedVariantImage.value = '';
    selectedColor.value = '';
    selectedSize.value = '';
    selectedCustomOption.value = '';
    selectedVariant.value = null;

    const hasColors = availableColors.value.length > 0;
    const hasSizes = availableSizes.value.length > 0;
    if (!hasColors && !hasSizes && pData?.productVariants?.length) {
      selectedVariant.value = pData.productVariants[0];
    }
  } catch (e) {
    console.error('Error loading product by slug:', e);
    product.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductData();
});

watch(() => route.params.slug, () => {
  fetchProductData();
});

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
