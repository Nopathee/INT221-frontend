<script setup>
import { computed, defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  name: String,
  accessRight: String,
  collabOid: String,
  edit:Boolean,
  delete:Boolean,
  leave:Boolean,
  boardName: String,
});

const newAccess = ref('');

onMounted(() => {
  newAccess.value = props.accessRight;
});

const newCollab = computed(() => ({
  collabOid: props.collabOid,
  accessRight: newAccess.value,
}));

defineEmits(['confirm', 'closeModalAccess', 'confirmDelete', 'closeModalDelete' ,'closeModalLeave' , 'confirmLeave' ]);
</script>

<template>
  <div>
    <!-- Modal Change Access -->
    <div v-if="edit" class="fixed inset-0 flex items-center justify-center z-50 itbkk-modal-alert">
      <div class="bg-white rounded-lg p-8 w-3/5 shadow-2xl dark:bg-gray-700">
        <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Change Access Right
          </h2>
        </div>
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white itbkk-message">
            Do you want to change access right of "{{ props.name }}" to
            "{{ props.accessRight}}"?
          </h2>
        </div>
        <div class="flex justify-end">
          <button
            @click="$emit('confirm', newCollab)"
            class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 itbkk-button-confirm"
          >
            Confirm
          </button>
          <button
            @click="$emit('closeModalAccess')"
            class="px-4 py-2 bg-red-500 text-white rounded-md itbkk-button-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete -->
    <div v-if="delete" class="fixed inset-0 flex items-center justify-center z-50 itbkk-modal-alert">
      <div class="bg-white rounded-lg p-8 w-3/5 shadow-2xl dark:bg-gray-700">
        <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Remove Collaborator
          </h2>
        </div>
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white itbkk-message">
            Do you want to remove "{{ props.name }}" from the board?
          </h2>
        </div>
        <div class="flex justify-end">
          <button
            @click="$emit('confirmDelete', props.collabOid)"
            class="px-4 py-2 bg-red-500 text-white rounded-md mr-2 itbkk-button-confirm"
          >
            Confirm
          </button>
          <button
            @click="$emit('closeModalDelete')"
            class="px-4 py-2 bg-gray-500 text-white rounded-md itbkk-button-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="leave" class="fixed inset-0 flex items-center justify-center z-50 itbkk-modal-alert">
      <div class="bg-white rounded-lg p-8 w-3/5 shadow-2xl dark:bg-gray-700">
        <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Leave Board
          </h2>
        </div>
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white itbkk-message">
            Do you want to leave this "{{ props.boardName }}" board?
          </h2>
        </div>
        <div class="flex justify-end">
          <button
            @click="$emit('confirmLeave')"
            class="px-4 py-2 bg-red-500 text-white rounded-md mr-2 itbkk-button-confirm"
          >
            Confirm
          </button>
          <button
            @click="$emit('closeModalLeave')"
            class="px-4 py-2 bg-gray-500 text-white rounded-md itbkk-button-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
