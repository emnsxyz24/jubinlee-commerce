<template>
  <div class="w-full space-y-2">
    <div
      v-if="!multiple && modelValue"
      class="relative group rounded-2xl overflow-hidden bg-[#FAF6F1] border border-[#E4D8CC] shadow-2xs w-full max-w-[260px] aspect-4/3"
    >
      <img
        :src="typeof modelValue === 'string' ? modelValue : ''"
        alt="Uploaded Image"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
      >
        <button
          type="button"
          @click="triggerFileInput"
          :disabled="isUploading"
          class="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#1A170F] text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <Camera class="w-3.5 h-3.5" />
          <span>Change</span>
        </button>
        <button
          type="button"
          @click="removeSingleImage"
          :disabled="isUploading"
          class="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>

    <div v-else-if="multiple && Array.isArray(modelValue) && modelValue.length > 0">
      <div class="flex flex-wrap items-center gap-3">
        <div
          v-for="(imgUrl, idx) in modelValue"
          :key="imgUrl + idx"
          class="relative group rounded-2xl overflow-hidden bg-[#FAF6F1] border border-[#E4D8CC] shadow-2xs w-24 h-24 sm:w-28 sm:h-28 shrink-0"
        >
          <img :src="imgUrl" alt="Product Image" class="w-full h-full object-cover" />
          <div
            v-if="idx === 0"
            class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#1A170F]/85 text-[#FAF6F1] text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-xs shadow-xs"
          >
            Cover
          </div>
          <div
            class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5"
          >
            <button
              v-if="idx > 0"
              type="button"
              @click="setPrimaryImage(idx)"
              title="Set as Cover Image"
              class="w-7 h-7 rounded-lg bg-white/95 hover:bg-white text-[#1A170F] flex items-center justify-center transition shadow-sm cursor-pointer"
            >
              <Star class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </button>
            <button
              type="button"
              @click="removeMultipleImage(idx)"
              title="Delete Photo"
              class="w-7 h-7 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-sm cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            isDragging ? 'border-[#E04F26] bg-[#FBEAE5]' : 'border-[#E4D8CC] bg-[#FAF6F1] hover:border-[#1A170F]/40'
          ]"
          class="rounded-2xl border-2 border-dashed w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex flex-col items-center justify-center p-2 text-center transition cursor-pointer"
        >
          <Loader2 v-if="isUploading" class="w-5 h-5 animate-spin text-[#E04F26] mb-1" />
          <template v-else>
            <Plus class="w-6 h-6 text-[#7D766E] mb-0.5" />
            <span class="text-[10px] font-bold text-[#1A170F]">Add Photo</span>
          </template>
        </div>
      </div>
    </div>

    <div
      v-if="(!multiple && !modelValue) || (multiple && (!Array.isArray(modelValue) || modelValue.length === 0))"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        isDragging ? 'border-[#E04F26] bg-[#FBEAE5]' : 'border-[#E4D8CC] bg-[#FAF6F1] hover:border-[#1A170F]/40'
      ]"
      class="rounded-2xl border-2 border-dashed py-6 px-4 flex flex-col items-center justify-center text-center transition cursor-pointer"
    >
      <div v-if="isUploading" class="py-2 flex flex-col items-center">
        <Loader2 class="w-7 h-7 animate-spin text-[#E04F26] mb-2" />
        <span class="text-xs font-bold text-[#1A170F]">Uploading to storage...</span>
      </div>
      <div v-else class="flex flex-col items-center space-y-1.5">
        <div class="w-10 h-10 rounded-xl bg-[#F2ECE5] flex items-center justify-center text-[#7D766E]">
          <Upload class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-bold text-[#1A170F]">
            Click to upload or drag and drop image here
          </p>
          <p class="text-[10px] text-[#8C8275] mt-0.5">
            Supports JPG, PNG, WEBP (Max 5MB)
          </p>
        </div>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      :multiple="multiple"
      accept="image/jpeg,image/png,image/webp,image/avif"
      @change="handleFileChange"
    />

    <p v-if="errorMessage" class="text-[11px] font-medium text-rose-600 mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Camera, Trash2, Star, Plus, Upload, Loader2 } from 'lucide-vue-next';
import { API_BASE_URL } from '@/config';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[];
    multiple?: boolean;
    folder?: string;
  }>(),
  {
    modelValue: '',
    multiple: false,
    folder: 'products',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
}>();

const authStore = useAuthStore();
const toastStore = useToastStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isUploading = ref(false);
const errorMessage = ref('');

const triggerFileInput = () => {
  if (isUploading.value) return;
  fileInputRef.value?.click();
};

const validateFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = `File format for ${file.name} is not supported. Use JPG, PNG, or WEBP.`;
    toastStore.error(errorMessage.value);
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = `File size for ${file.name} exceeds the 5MB limit.`;
    toastStore.error(errorMessage.value);
    return false;
  }
  return true;
};

const uploadFile = async (files: File[]) => {
  const validFiles = files.filter(validateFile);
  if (!validFiles.length) return;

  isUploading.value = true;
  errorMessage.value = '';

  try {
    if (props.multiple) {
      const formData = new FormData();
      validFiles.forEach((file) => formData.append('files', file));

      const res = await fetch(`${API_BASE_URL}/admin/upload/images?folder=${props.folder}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload images');
      }

      const results = await res.json();
      const newUrls = results.map((r: { url: string }) => r.url);
      const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
      emit('update:modelValue', [...current, ...newUrls]);
      toastStore.success(`${newUrls.length} images uploaded successfully.`);
    } else {
      const file = validFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/admin/upload/image?folder=${props.folder}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload image');
      }

      const result = await res.json();
      emit('update:modelValue', result.url);
      toastStore.success('Image uploaded successfully.');
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An error occurred during upload';
    toastStore.error(errorMessage.value);
  } finally {
    isUploading.value = false;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length) {
    uploadFile(Array.from(target.files));
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files.length) {
    uploadFile(Array.from(e.dataTransfer.files));
  }
};

const removeSingleImage = () => {
  emit('update:modelValue', '');
};

const removeMultipleImage = (index: number) => {
  if (Array.isArray(props.modelValue)) {
    const next = [...props.modelValue];
    next.splice(index, 1);
    emit('update:modelValue', next);
  }
};

const setPrimaryImage = (index: number) => {
  if (Array.isArray(props.modelValue) && index < props.modelValue.length) {
    const next = [...props.modelValue];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    emit('update:modelValue', next);
  }
};
</script>
