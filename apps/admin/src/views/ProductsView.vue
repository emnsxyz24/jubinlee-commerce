<template>
  <AdminLayout>
    <div class="space-y-7">

      <div
        class="rounded-[28px] bg-[#EBE3DA] m3-hero-shadow relative overflow-hidden p-7 sm:p-9 border border-[#E4D8CC]"
      >
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#1A170F]/5 blur-2xl pointer-events-none" />
        <div class="absolute right-28 -bottom-20 w-64 h-64 rounded-full bg-[#F4ECE5]/80 blur-xl pointer-events-none" />

        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="px-0.5">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A170F]/10 text-[#1A170F] text-[11px] font-bold tracking-wider uppercase mb-3">
              <Shirt class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee Catalog Studio</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Products Catalog
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Curate fashion collections, manage stock variants, gallery imagery, and live storefront statuses.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Total Products</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">{{ products.length }} Items</span>
            </div>
            <button
              v-if="authStore.hasPermission('products.write')"
              type="button"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] font-bold text-xs text-white shadow-md transition cursor-pointer"
              @click="openModal()"
            >
              <Plus class="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      <div
        class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 border border-[#E4D8CC]"
      >
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[260px] relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D766E]">
              <Search class="w-4 h-4" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search product name, slug, or SKU..."
              @input="debounceSearch"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] placeholder:text-[#7D766E]/60 focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
            />
          </div>

          <div class="w-48">
            <AdminSelect
              v-model="statusFilter"
              :options="statusFilterOptions"
              placeholder="All Statuses"
              icon="filter"
              full-width
              @update:model-value="fetchProducts"
            />
          </div>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading product catalog...</div>
        </div>

        <div v-else-if="!products.length" class="p-16 text-center text-[#7D766E] text-xs">
          <Shirt class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No products found</div>
          <p class="text-xs text-[#9E978F] mt-1">Try changing your search filter or click "+ Add New Product" to create one.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Product</th>
                <th class="py-4 px-6">Category</th>
                <th class="py-4 px-6">Base Price</th>
                <th class="py-4 px-6">Variants / Stock</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="p in products" :key="p.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3.5">
                    <div class="w-12 h-14 rounded-2xl bg-[#F4ECE5] overflow-hidden shrink-0 shadow-2xs">
                      <img 
                        :src="p.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400'" 
                        :alt="p.name" 
                        class="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#1A170F]">{{ p.name }}</div>
                      <div class="text-[10px] text-[#9E978F] font-mono mt-0.5">{{ p.slug }}</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#FAF6F1] text-[#4A433C] text-[11px] font-semibold">
                    {{ p.category?.name || 'Unassigned' }}
                  </span>
                </td>

                <td class="py-4 px-6 font-extrabold text-sm text-[#1A170F] tabular-nums">
                  Rp{{ formatPrice(p.basePrice) }}
                </td>

                <td class="py-4 px-6">
                  <div class="font-bold text-xs text-[#1A170F] tabular-nums">
                    {{ p.productVariants?.length || 0 }} variants
                  </div>
                  <div class="text-[10px] text-[#7D766E] tabular-nums">
                    {{ calculateTotalStock(p) }} total stock
                  </div>
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="[
                      p.status === 'published' ? 'bg-[#E8F8F0] text-[#128C7E]' :
                      p.status === 'draft' ? 'bg-[#FAF6F1] text-[#7D766E]' : 'bg-[#FDE8E8] text-[#9B1C1C]'
                    ]"
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  >
                    {{ p.status }}
                  </span>
                </td>

                <td class="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                  <button
                    v-if="authStore.hasPermission('products.write')"
                    type="button"
                    class="p-2 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
                    @click="openModal(p)"
                    title="Edit product"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    v-if="authStore.hasPermission('products.write')"
                    type="button"
                    class="p-2 rounded-xl text-[#7D766E] hover:text-rose-600 hover:bg-[#FAF6F1] transition cursor-pointer"
                    @click="deleteProduct(p.id)"
                    title="Delete product"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div 
        v-if="showModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs cursor-default"
        role="dialog"
        aria-modal="true"
        @click="showModal = false"
      >
        <div class="relative w-full max-w-[840px] max-h-[90vh] cursor-default" @click.stop>
          <div
            ref="modalScrollRef"
            class="w-full max-h-[90vh] bg-[#FFFDFB] rounded-[28px] p-6 sm:p-8 m3-card-shadow border border-[#E4D8CC] overflow-y-auto space-y-6"
          >
            <div class="flex justify-between items-start pb-4 border-b border-[#E4D8CC]/70">
              <div>
                <h2 class="text-xl font-extrabold text-[#1A170F]">
                  {{ editingId ? 'Edit Product Details' : 'Add New Product' }}
                </h2>
              <p class="text-xs text-[#7D766E] mt-1">Configure catalog information, pricing, gallery photos, and descriptions.</p>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] cursor-pointer"
              @click="showModal = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Product Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g. Classic Linen Overshirt"
                  required
                  @input="autoSlug"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Slug URL *</label>
                <input
                  v-model="form.slug"
                  type="text"
                  placeholder="classic-linen-overshirt"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Category</label>
                <AdminSelect
                  v-model="form.categoryId"
                  :options="categoryOptions"
                  placeholder="Select Category"
                  full-width
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Base Price (IDR) *</label>
                <input
                  v-model.number="form.basePrice"
                  type="number"
                  placeholder="199000"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Storefront Status</label>
                <AdminSelect
                  v-model="form.status"
                  :options="productStatusOptions"
                  placeholder="Select Status"
                  full-width
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2.5">
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider">Product Photos (Primary & Gallery)</label>
                <span class="text-[10px] text-[#7D766E]">Format JPG, PNG, WEBP (Max 5MB)</span>
              </div>
              <ImageUpload
                v-model="form.images"
                multiple
                folder="products"
              />
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC] space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F] block">Default Variant (Color & Sizes)</span>
                  <span class="text-[10px] text-[#7D766E]">Enable color options with size stock breakdown</span>
                </div>
                <ToggleSwitch v-model="form.defaultVariantEnabled" />
              </div>

              <div v-if="form.defaultVariantEnabled" class="space-y-4 pt-2">
                <div class="p-3.5 rounded-xl bg-[#FFFDFB] border border-[#E4D8CC]/80 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label class="block text-[10px] font-bold uppercase text-[#7D766E]">Size Type</label>
                    <div class="inline-flex rounded-xl bg-[#FAF6F1] p-1 border border-[#E4D8CC]/70">
                      <button
                        type="button"
                        @click="form.sizeType = 'letter'"
                        :class="[
                          form.sizeType === 'letter'
                            ? 'bg-[#1A170F] text-white shadow-xs'
                            : 'text-[#7D766E] hover:text-[#1A170F]'
                        ]"
                        class="px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Letter (S, M, L, XL, XXL)
                      </button>
                      <button
                        type="button"
                        @click="form.sizeType = 'numeric'"
                        :class="[
                          form.sizeType === 'numeric'
                            ? 'bg-[#1A170F] text-white shadow-xs'
                            : 'text-[#7D766E] hover:text-[#1A170F]'
                        ]"
                        class="px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Numeric (Footwear / Custom)
                      </button>
                    </div>
                  </div>

                  <div v-if="form.sizeType === 'numeric'" class="pt-2 border-t border-[#F4ECE5] space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold uppercase text-[#7D766E]">Configured Numeric Sizes</span>
                      <span class="text-[10px] text-[#9E978F]">Add or remove size numbers</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <div
                        v-for="(ns, nIdx) in form.numericSizes"
                        :key="nIdx"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF6F1] border border-[#E4D8CC] text-xs font-bold text-[#1A170F]"
                      >
                        <span>{{ ns }}</span>
                        <button
                          type="button"
                          @click="removeNumericSize(nIdx)"
                          class="text-[#9E978F] hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div class="flex items-center gap-1.5">
                        <input
                          type="text"
                          v-model="newNumericInput"
                          placeholder="e.g. 43"
                          @keydown.enter.prevent="addNumericSize"
                          class="w-20 px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FAF6F1] border border-[#E4D8CC] focus:outline-none focus:ring-1 focus:ring-[#1A170F]"
                        />
                        <button
                          type="button"
                          @click="addNumericSize"
                          class="px-2.5 py-1 rounded-lg bg-[#1A170F] text-white text-xs font-bold cursor-pointer hover:bg-[#332F28]"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  v-for="(colorRow, cIdx) in form.colors" 
                  :key="cIdx"
                  class="p-4 rounded-xl bg-[#FFFDFB] border border-[#E4D8CC]/80 space-y-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div class="sm:col-span-4">
                        <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-1">Color Name *</label>
                        <input
                          v-model="colorRow.name"
                          type="text"
                          placeholder="e.g. Natural, Black, Navy"
                          class="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-xs text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                        />
                      </div>
                      <div class="sm:col-span-3">
                        <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-1">Color Hex (Optional)</label>
                        <div class="flex items-center gap-2">
                          <input 
                            type="color" 
                            v-model="colorRow.colorHex"
                            class="w-8 h-8 rounded-lg cursor-pointer border border-[#E4D8CC] p-0.5 bg-white shrink-0"
                          />
                          <input
                            v-model="colorRow.colorHex"
                            type="text"
                            placeholder="#000000"
                            class="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-xs font-mono text-[#1A170F] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div class="sm:col-span-5">
                        <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-1">Color Photo (Optional)</label>
                        <ImageUpload
                          v-model="colorRow.imageUrl"
                          :multiple="false"
                          folder="products"
                        />
                      </div>
                    </div>

                    <button
                      v-if="form.colors.length > 1"
                      type="button"
                      class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                      @click="removeColor(cIdx)"
                      title="Remove Color"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>

                  <div class="pt-2 border-t border-[#F4ECE5]">
                    <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-1.5">Size Stock Quantity (Leave empty if unavailable, set 0 if out of stock)</label>
                    <div class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      <div v-for="sz in activeSizesList" :key="sz">
                        <div class="text-[9px] font-bold text-center text-[#4A433C] mb-0.5">{{ sz }}</div>
                        <input
                          v-model="colorRow.stocks[sz]"
                          type="number"
                          min="0"
                          placeholder="—"
                          class="w-full px-2 py-1.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-xs text-center text-[#1A170F] focus:outline-none focus:ring-1 focus:ring-[#E04F26]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F1] hover:bg-[#F2ECE5] text-[#1A170F] font-bold text-xs border border-[#E4D8CC] transition cursor-pointer"
                  @click="addColor"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>Add Color</span>
                </button>
              </div>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC] space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F] block">Custom Variant</span>
                  <span class="text-[10px] text-[#7D766E]">Single freeform variant group (e.g. Edition, Bundling, Packaging)</span>
                </div>
                <ToggleSwitch v-model="form.customVariantEnabled" />
              </div>

              <div v-if="form.customVariantEnabled" class="space-y-4 pt-2">
                <div class="p-4 rounded-xl bg-[#FFFDFB] border border-[#E4D8CC]/80 space-y-3">
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-1">Variant Group Name *</label>
                    <input
                      v-model="form.customVariant.name"
                      type="text"
                      placeholder="e.g. Edition, Bundling, Packaging"
                      class="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-xs text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                    />
                  </div>

                  <div class="space-y-2 pt-2 border-t border-[#F4ECE5]">
                    <label class="block text-[10px] font-bold uppercase text-[#7D766E]">Group Options & Photos</label>
                    <div
                      v-for="(opt, oIdx) in form.customVariant.options"
                      :key="oIdx"
                      class="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAF6F1]"
                    >
                      <div class="flex-1">
                        <input
                          v-model="opt.name"
                          type="text"
                          placeholder="Option name (e.g. Standard Box, Deluxe Edition)"
                          class="w-full px-3.5 py-2 rounded-xl bg-[#FFFDFB] border border-[#E4D8CC] text-xs text-[#1A170F] focus:outline-none"
                        />
                      </div>
                      <div class="w-48">
                        <ImageUpload
                          v-model="opt.imageUrl"
                          :multiple="false"
                          folder="products"
                        />
                      </div>
                      <button
                        v-if="form.customVariant.options.length > 1"
                        type="button"
                        class="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        @click="removeCustomOption(oIdx)"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      class="inline-flex items-center gap-1 text-xs font-bold text-[#E04F26] hover:underline cursor-pointer"
                      @click="addCustomOption"
                    >
                      <Plus class="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Product Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Material details, size & fit guide, and aesthetic styling notes..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
              />
            </div>

            <div v-if="!form.defaultVariantEnabled && !editingId" class="p-4 sm:p-5 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC] space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Standard Single Variant</span>
                <span class="text-[10px] text-[#7D766E]">Basic inventory tracking</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-2">SKU</label>
                  <input
                    v-model="form.initialSku"
                    type="text"
                    class="w-full px-3.5 py-2 rounded-xl bg-[#FFFDFB] border border-[#E4D8CC] text-xs text-[#1A170F] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase text-[#7D766E] mb-2">Initial Stock</label>
                  <input
                    v-model.number="form.initialStock"
                    type="number"
                    class="w-full px-3.5 py-2 rounded-xl bg-[#FFFDFB] border border-[#E4D8CC] text-xs text-[#1A170F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-[#E4D8CC]/70">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#7D766E] hover:bg-[#FAF6F1] transition cursor-pointer"
                @click="showModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-7 py-2.5 rounded-xl font-bold text-xs text-white bg-[#E04F26] hover:bg-[#C8431E] shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                <span>{{ editingId ? 'Update Product' : 'Save Product' }}</span>
              </button>
            </div>
          </form>
        </div>
        <ModalScrollbar :target="modalScrollRef" />
      </div>
    </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import ImageUpload from '../components/ImageUpload.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import AdminSelect from '../components/AdminSelect.vue';
import ModalScrollbar from '../components/ModalScrollbar.vue';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { API_BASE_URL } from '../config';
import { Shirt, Plus, Search, Loader2, Pencil, Trash2, X } from 'lucide-vue-next';

const modalScrollRef = ref<any>(null);

interface ColorRow {
  name: string;
  colorHex: string;
  imageUrl: string;
  stocks: Record<string, any>;
}

interface CustomOption {
  name: string;
  imageUrl: string;
}

interface CustomGroup {
  name: string;
  options: CustomOption[];
}

const authStore = useAuthStore();
const toastStore = useToastStore();
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);

const statusFilter = ref('');
const searchQuery = ref('');
const showModal = ref(false);
const editingId = ref<string | null>(null);

const newNumericInput = ref('');

const statusFilterOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const productStatusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const categoryOptions = computed(() => {
  const list = Array.isArray(categories.value) ? categories.value : [];
  return [{ value: '', label: 'Unassigned' }, ...list.map((c: any) => ({ value: c.id, label: c.name }))];
});

const defaultStocks = () => ({});

const form = ref({
  name: '',
  slug: '',
  categoryId: '',
  basePrice: 199000,
  status: 'published',
  description: '',
  images: [] as string[],
  initialSku: '',
  initialStock: 10,
  defaultVariantEnabled: false,
  sizeType: 'letter' as 'letter' | 'numeric',
  numericSizes: ['38', '39', '40', '41', '42'] as string[],
  colors: [
    { name: 'Standard', colorHex: '#000000', imageUrl: '', stocks: defaultStocks() },
  ] as ColorRow[],
  customVariantEnabled: false,
  customVariant: {
    name: 'Edition',
    options: [{ name: 'Standard Edition', imageUrl: '' }],
  } as CustomGroup,
});

const activeSizesList = computed(() => {
  if (form.value.sizeType === 'numeric') {
    return form.value.numericSizes.length > 0 ? form.value.numericSizes : ['38', '39', '40', '41', '42'];
  }
  return ['S', 'M', 'L', 'XL', 'XXL'];
});

const addNumericSize = () => {
  const val = newNumericInput.value.trim();
  if (val && !form.value.numericSizes.includes(val)) {
    form.value.numericSizes.push(val);
    for (const colorRow of form.value.colors) {
      if (colorRow.stocks[val] === undefined) {
        colorRow.stocks[val] = 0;
      }
    }
  }
  newNumericInput.value = '';
};

const removeNumericSize = (idx: number) => {
  if (form.value.numericSizes.length > 1) {
    const removed = form.value.numericSizes.splice(idx, 1)[0];
    if (removed) {
      for (const colorRow of form.value.colors) {
        delete colorRow.stocks[removed];
      }
    }
  }
};

const addColor = () => {
  const initialStocks: Record<string, number> = {};
  for (const s of activeSizesList.value) {
    initialStocks[s] = 0;
  }
  form.value.colors.push({
    name: '',
    colorHex: '#000000',
    imageUrl: '',
    stocks: initialStocks,
  });
};

const removeColor = (idx: number) => {
  if (form.value.colors.length > 1) {
    form.value.colors.splice(idx, 1);
  }
};

const addCustomOption = () => {
  form.value.customVariant.options.push({
    name: '',
    imageUrl: '',
  });
};

const removeCustomOption = (oIdx: number) => {
  if (form.value.customVariant.options.length > 1) {
    form.value.customVariant.options.splice(oIdx, 1);
  }
};

const autoSlug = () => {
  if (!editingId.value) {
    const cleanSlug = form.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    form.value.slug = cleanSlug;
    if (cleanSlug) {
      form.value.initialSku = `SKU-${cleanSlug.toUpperCase()}-STD`;
    }
  }
};

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchProducts();
  }, 350);
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    let url = `${API_BASE_URL}/admin/products?status=${statusFilter.value}`;
    if (searchQuery.value) {
      url += `&q=${encodeURIComponent(searchQuery.value)}`;
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    products.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    categories.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch {
    categories.value = [];
  }
};

const calculateTotalStock = (product: any) => {
  if (!product.productVariants || !Array.isArray(product.productVariants)) return 0;
  return product.productVariants.reduce((sum: number, v: any) => sum + Number(v.stockQuantity || 0), 0);
};

const openModal = (product: any = null) => {
  if (product && typeof product === 'object' && typeof product.id === 'string' && typeof product.name === 'string') {
    editingId.value = product.id;
    const vConfig = product.attributes?.variantConfig;

    let defaultVariantEnabled = false;
    let sizeType: 'letter' | 'numeric' = 'letter';
    let numericSizes: string[] = ['38', '39', '40', '41', '42'];
    let colors: ColorRow[] = [{ name: 'Standard', colorHex: '#000000', imageUrl: '', stocks: defaultStocks() }];
    let customVariantEnabled = false;
    let customVariant: CustomGroup = { name: 'Edition', options: [{ name: 'Standard Edition', imageUrl: '' }] };

    if (vConfig) {
      defaultVariantEnabled = Boolean(vConfig.defaultVariantEnabled);
      sizeType = vConfig.sizeType === 'numeric' ? 'numeric' : 'letter';
      if (Array.isArray(vConfig.numericSizes) && vConfig.numericSizes.length > 0) {
        numericSizes = vConfig.numericSizes.map(String);
      }
      if (Array.isArray(vConfig.colors) && vConfig.colors.length > 0) {
        colors = vConfig.colors.map((c: any) => ({
          name: c.name || '',
          colorHex: c.colorHex || '#000000',
          imageUrl: c.imageUrl || '',
          stocks: typeof c.stocks === 'object' && c.stocks ? c.stocks : defaultStocks(),
        }));
      }
      customVariantEnabled = Boolean(vConfig.customVariantEnabled);
      if (vConfig.customVariant && typeof vConfig.customVariant === 'object') {
        customVariant = {
          name: vConfig.customVariant.name || 'Edition',
          options: Array.isArray(vConfig.customVariant.options) && vConfig.customVariant.options.length > 0
            ? vConfig.customVariant.options.map((o: any) => ({ name: o.name || '', imageUrl: o.imageUrl || '' }))
            : [{ name: '', imageUrl: '' }],
        };
      } else if (Array.isArray(vConfig.customVariants) && vConfig.customVariants.length > 0) {
        const first = vConfig.customVariants[0];
        customVariant = {
          name: first.name || 'Edition',
          options: Array.isArray(first.options) && first.options.length > 0
            ? first.options.map((o: any) => ({ name: o.name || '', imageUrl: o.imageUrl || '' }))
            : [{ name: '', imageUrl: '' }],
        };
      }
    } else if (Array.isArray(product.productVariants) && product.productVariants.length > 0) {
      const colorMap: Record<string, ColorRow> = {};
      let hasMulti = false;
      const detectedNumericSizes = new Set<string>();

      for (const v of product.productVariants) {
        const cName = v.color || 'Standard';
        if (!colorMap[cName]) {
          colorMap[cName] = {
            name: cName,
            colorHex: v.colorHex || '#000000',
            imageUrl: '',
            stocks: {},
          };
        }
        if (v.size) {
          colorMap[cName].stocks[v.size] = Number(v.stockQuantity) || 0;
          if (!['S', 'M', 'L', 'XL', 'XXL'].includes(v.size)) {
            detectedNumericSizes.add(v.size);
          }
          hasMulti = true;
        }
      }

      if (detectedNumericSizes.size > 0) {
        sizeType = 'numeric';
        numericSizes = Array.from(detectedNumericSizes);
      }

      const parsedColors = Object.values(colorMap);
      if (parsedColors.length > 0) {
        colors = parsedColors;
      }
      defaultVariantEnabled = hasMulti;
    }

    form.value = {
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId || '',
      basePrice: Number(product.basePrice),
      status: product.status,
      description: product.description || '',
      images: Array.isArray(product.productImages) ? product.productImages.map((img: any) => img.url) : [],
      initialSku: '',
      initialStock: 0,
      defaultVariantEnabled,
      sizeType,
      numericSizes,
      colors,
      customVariantEnabled,
      customVariant,
    };
  } else {
    editingId.value = null;
    form.value = {
      name: '',
      slug: '',
      categoryId: '',
      basePrice: 199000,
      status: 'published',
      description: '',
      images: [],
      initialSku: '',
      initialStock: 10,
      defaultVariantEnabled: false,
      sizeType: 'letter',
      numericSizes: ['38', '39', '40', '41', '42'],
      colors: [
        { name: 'Standard', colorHex: '#000000', imageUrl: '', stocks: defaultStocks() },
      ],
      customVariantEnabled: false,
      customVariant: {
        name: 'Edition',
        options: [{ name: 'Standard Edition', imageUrl: '' }],
      },
    };
  }
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    saving.value = true;
    const method = editingId.value ? 'PATCH' : 'POST';
    const url = editingId.value 
      ? `${API_BASE_URL}/admin/products/${editingId.value}`
      : `${API_BASE_URL}/admin/products`;

    const variantConfig = {
      defaultVariantEnabled: form.value.defaultVariantEnabled,
      sizeType: form.value.sizeType,
      numericSizes: form.value.sizeType === 'numeric' ? form.value.numericSizes : undefined,
      colors: form.value.defaultVariantEnabled ? form.value.colors : [],
      customVariantEnabled: form.value.customVariantEnabled,
      customVariant: form.value.customVariantEnabled ? form.value.customVariant : undefined,
    };

    const prefix = (form.value.slug || form.value.name)
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const generatedVariants: any[] = [];

    if (form.value.defaultVariantEnabled) {
      const sizesToEvaluate = activeSizesList.value;

      for (const colorRow of form.value.colors) {
        const cName = colorRow.name.trim() || 'Standard';
        const cCode = cName.toUpperCase().replace(/[^A-Z0-9]+/g, '');

        for (const sz of sizesToEvaluate) {
          const rawVal = colorRow.stocks ? colorRow.stocks[sz] : undefined;
          if (rawVal !== '' && rawVal !== null && rawVal !== undefined && !isNaN(Number(rawVal))) {
            const qty = Math.max(0, parseInt(String(rawVal), 10));
            generatedVariants.push({
              sku: `SKU-${prefix}-${cCode}-${sz}`,
              size: sz,
              color: cName,
              colorHex: colorRow.colorHex || undefined,
              stockQuantity: qty,
            });
          }
        }
      }

      if (generatedVariants.length === 0) {
        throw new Error('Default Variant is enabled: please specify at least one size stock (0 or more) for your color variants.');
      }
    } else if (!editingId.value) {
      const fallbackSku = form.value.slug ? `SKU-${form.value.slug.toUpperCase()}-STD` : `SKU-ITEM-${Date.now().toString().slice(-4)}`;
      generatedVariants.push({
        sku: form.value.initialSku?.trim() || fallbackSku,
        size: null,
        color: 'Standard',
        stockQuantity: Number(form.value.initialStock) || 0,
      });
    }

    const body: any = {
      name: form.value.name,
      slug: form.value.slug,
      categoryId: form.value.categoryId || undefined,
      basePrice: form.value.basePrice,
      status: form.value.status,
      description: form.value.description,
      attributes: {
        variantConfig,
      },
      images: form.value.images.map((url, idx) => ({
        url,
        isPrimary: idx === 0,
        displayOrder: idx,
      })),
    };

    if (generatedVariants.length > 0) {
      body.variants = generatedVariants;
    }

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = Array.isArray(err.message) ? err.message.join(', ') : (err.message || 'Failed to save product');
      throw new Error(message);
    }

    showModal.value = false;
    toastStore.success(`Product "${form.value.name}" successfully ${editingId.value ? 'updated' : 'added'}`);
    await fetchProducts();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to save product');
  } finally {
    saving.value = false;
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    toastStore.success('Product deleted from catalog');
    await fetchProducts();
  } catch (e) {
    toastStore.error('Failed to delete product');
  }
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
