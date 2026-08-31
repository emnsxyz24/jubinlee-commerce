<template>
  <AdminLayout>
    <div class="space-y-7">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-0.5">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1A170F] tracking-tight">Categories & Departments</h1>
            <span class="text-[11px] font-bold text-[#7D766E] bg-[#F2ECE5] px-3 py-1 rounded-full">
              {{ categories.length }} Categories
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7D766E] mt-1">Organize fashion collections, taxonomy, and storefront navigation menus.</p>
        </div>

        <button
          v-if="authStore.hasPermission('categories.write')"
          type="button"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] text-white font-bold text-xs shadow-md transition cursor-pointer"
          @click="openModal()"
        >
          <Plus class="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading categories...</div>
        </div>

        <div v-else-if="!categories.length" class="p-16 text-center text-[#7D766E] text-xs">
          <Layers class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No categories registered</div>
          <p class="text-xs text-[#9E978F] mt-1">Add a new category to group and organize products in the catalog.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6 min-w-[200px]">Category Name</th>
                <th class="py-4 px-6 min-w-[160px]">Slug URL</th>
                <th class="py-4 px-6 min-w-[130px]">Total Products</th>
                <th class="py-4 px-6 min-w-[110px]">Status</th>
                <th class="py-4 px-6 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="c in categories" :key="c.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-[#F4ECE5] text-[#1A170F] flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      <Layers class="w-5 h-5 text-[#1A170F]" />
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#1A170F]">{{ c.name }}</div>
                      <div v-if="c.description" class="text-[11px] text-[#9E978F] truncate max-w-xs">{{ c.description }}</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6 font-mono text-[#7D766E]">
                  /collections/{{ c.slug }}
                </td>

                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#FAF6F1] text-[#1A170F] text-[11px] font-bold">
                    {{ c._count?.products || 0 }} products
                  </span>
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="[c.isActive ? 'bg-[#E8F8F0] text-[#128C7E]' : 'bg-[#F2ECE5] text-[#7D766E]']" 
                    class="px-3 py-1 rounded-full text-[10px] font-bold"
                  >
                    {{ c.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                  <button
                    v-if="authStore.hasPermission('categories.write')"
                    type="button"
                    class="p-2 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
                    @click="openModal(c)"
                    title="Edit category"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    v-if="authStore.hasPermission('categories.write')"
                    type="button"
                    class="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    @click="deleteCategory(c.id)"
                    title="Delete category"
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
        <div class="relative w-full max-w-[580px] max-h-[90vh] cursor-default" @click.stop>
          <div
            ref="modalScrollRef"
            class="w-full max-h-[90vh] bg-[#FFFDFB] rounded-[28px] p-6 sm:p-8 m3-card-shadow border border-[#E4D8CC] overflow-y-auto space-y-6"
          >
            <div class="flex justify-between items-start pb-4 border-b border-[#E4D8CC]/70">
              <div>
                <h2 class="text-xl font-extrabold text-[#1A170F]">
                  {{ editingId ? 'Edit Category' : 'Add New Category' }}
                </h2>
                <p class="text-xs text-[#7D766E] mt-1">Configure name, URL slug, cover photo, and storefront menu visibility.</p>
              </div>
              <button
                type="button"
                class="p-1.5 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] cursor-pointer"
                @click="showModal = false"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="saveCategory" class="space-y-6">
              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Category Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g. Outerwear & Jackets"
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
                  placeholder="outerwear-jackets"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-2.5">
                  <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider">Category Cover Image</label>
                  <span class="text-[10px] text-[#7D766E]">Optional</span>
                </div>
                <ImageUpload
                  v-model="form.imageUrl"
                  folder="categories"
                />
              </div>

              <div class="flex items-center justify-between p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60">
                <div>
                  <div class="text-xs font-bold text-[#1A170F]">Show in Storefront Menu</div>
                  <div class="text-[10px] text-[#7D766E]">Active category can be browsed by visitors in the catalog</div>
                </div>
                <ToggleSwitch v-model="form.isActive" />
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
                  class="px-7 py-2.5 rounded-xl font-bold text-xs text-white bg-[#E04F26] hover:bg-[#C8431E] shadow-md transition cursor-pointer"
                >
                  {{ editingId ? 'Update Category' : 'Save Category' }}
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
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import ImageUpload from '../components/ImageUpload.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import ModalScrollbar from '../components/ModalScrollbar.vue';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { API_BASE_URL } from '../config';
import { Plus, Layers, Loader2, Pencil, Trash2, X } from 'lucide-vue-next';

const modalScrollRef = ref<any>(null);

const authStore = useAuthStore();
const toastStore = useToastStore();
const categories = ref<any[]>([]);
const loading = ref(true);
const showModal = ref(false);
const editingId = ref<string | null>(null);

const form = ref({ name: '', slug: '', imageUrl: '', isActive: true });

const autoSlug = () => {
  if (!editingId.value) {
    form.value.slug = form.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
};

const fetchCategories = async () => {
  try {
    loading.value = true;
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    categories.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

const openModal = (cat: any = null) => {
  if (cat && typeof cat === 'object' && typeof cat.id === 'string' && typeof cat.name === 'string') {
    editingId.value = cat.id;
    form.value = { name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl || '', isActive: cat.isActive };
  } else {
    editingId.value = null;
    form.value = { name: '', slug: '', imageUrl: '', isActive: true };
  }
  showModal.value = true;
};

const saveCategory = async () => {
  try {
    const method = editingId.value ? 'PATCH' : 'POST';
    const url = editingId.value 
      ? `${API_BASE_URL}/admin/categories/${editingId.value}` 
      : `${API_BASE_URL}/admin/categories`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save category');
    }

    showModal.value = false;
    toastStore.success(`Category "${form.value.name}" successfully ${editingId.value ? 'updated' : 'created'}`);
    await fetchCategories();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to save category');
  }
};

const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete category');
    }
    toastStore.success('Category deleted successfully');
    await fetchCategories();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to delete category');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
