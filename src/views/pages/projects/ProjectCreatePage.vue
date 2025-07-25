<template>
    <div class="flex flex-col overflow-auto h-full p-4">
        <h2 class="text-lg font-bold mb-4">Проект</h2>
        <ClientSearch v-model:selectedClient="selectedClient" :disabled="!!editingItemId" />
        <div>
            <label class="required">Название</label>
            <input type="text" v-model="name">
        </div>
        <div>
            <label>Дата проекта</label>
            <input type="datetime-local" v-model="date" :disabled="!!editingItemId">
        </div>
        <div>
            <label>Бюджет проекта</label>
            <input type="number" v-model="budget">
        </div>
        <div>
            <label>Назначить пользователей</label>
            <div v-if="users != null && users.length != 0" class="flex flex-wrap gap-2">
                <label v-for="user, index in users" :key="user.id"
                    class="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded">
                    <input type="checkbox" :value="user.id" v-model="selectedUsers" :id="'user-' + user.id">
                    <span class="text-black">{{ user.name }}</span>
                </label>
            </div>
        </div>
        <div>
            <label>Файлы</label>
            <input type="file" multiple @change="handleFileChange" />
            <ul>
                <li v-for="(file, index) in files" :key="index" class="flex items-center space-x-2">
                    <a :href="editingItem.getFileUrl(file)" :download="file.name" target="_blank"
                        class="text-blue-600 hover:underline">
                        {{ file.name || file.path }}
                    </a>
                    <button @click="showDeleteFileDialog(index)"
                        class="text-red-500 hover:text-red-700">Удалить</button>
                </li>
            </ul>
        </div>
    </div>
    <div class="mt-4 p-4 flex space-x-2 bg-[#edf4fb]">
        <PrimaryButton v-if="editingItem != null" :onclick="showDeleteDialog" :is-danger="true"
            :is-loading="deleteLoading" icon="fas fa-remove"
            :disabled="!$store.getters.hasPermission('projects_delete')">
            Удалить
        </PrimaryButton>
        <PrimaryButton icon="fas fa-save" :onclick="save" :is-loading="saveLoading" :disabled="(editingItemId != null && !$store.getters.hasPermission('projects_update')) ||
            (editingItemId == null && !$store.getters.hasPermission('projects_create'))">
            Сохранить
        </PrimaryButton>
    </div>
    <AlertDialog :dialog="deleteDialog" @confirm="deleteItem" @leave="closeDeleteDialog"
        :descr="'Подтвердите удаление проекта'" :confirm-text="'Удалить проект'" :leave-text="'Отмена'" />
    <AlertDialog :dialog="deleteFileDialog" @confirm="confirmDeleteFile" @leave="closeDeleteFileDialog"
        :descr="`Подтвердите удаление файла '${files[deleteFileIndex]?.name || 'без имени'}'`"
        :confirm-text="'Удалить файл'" :leave-text="'Отмена'" />
</template>


<script>
import UsersController from '@/api/UsersController';
import ClientController from '@/api/ClientController';
import TabBar from '@/views/components/app/forms/TabBar.vue';
import ProjectDto from '@/dto/project/ProjectDto';
import PrimaryButton from '@/views/components/app/buttons/PrimaryButton.vue';
import AlertDialog from '@/views/components/app/dialog/AlertDialog.vue';
import ProjectController from '@/api/ProjectController';
import api from '@/api/axiosInstance';
import ClientSearch from '@/views/components/app/search/ClientSearch.vue';
import getApiErrorMessage from '@/mixins/getApiErrorMessageMixin';

export default {
    mixins: [getApiErrorMessage],
    emits: ['saved', 'saved-error', 'deleted', 'deleted-error'],
    components: { PrimaryButton, AlertDialog, TabBar, ClientSearch },
    props: {
        editingItem: { type: ProjectDto, required: false, default: null }
    },
    data() {
        return {
            name: this.editingItem ? this.editingItem.name : '',
            budget: this.editingItem ? this.editingItem.budget : 0,
            date: this.editingItem ? this.editingItem.date : new Date().toISOString().substring(0, 16),
            dateObj: this.editingItem ? new Date(this.editingItem.date) : new Date(),
            selectedUsers: this.editingItem ? this.editingItem.users.map(user => user.id.toString()) : [],
            editingItemId: this.editingItem ? this.editingItem.id : null,
            selectedClient: this.editingItem ? this.editingItem.client : null,
            users: [],
            saveLoading: false,
            deleteDialog: false,
            deleteLoading: false,
            files: this.editingItem?.files || [],
            uploading: false,
            deleteFileDialog: false,
            deleteFileIndex: -1,
        }
    },
    created() {
        this.fetchUsers();
        this.fetchLastClients();
    },
    methods: {
        async fetchUsers() {
            this.users = await UsersController.getAllUsers();
        },
        async fetchLastClients() {
            const paginated = await ClientController.getItems(1);
            this.lastClients = paginated.items.slice(0, 10);
        },
        async save() {
            if (this.uploading) {
                alert('Дождитесь завершения загрузки файлов');
                return;
            }
            this.saveLoading = true;
            try {
                let resp;
                const payload = {
                    name: this.name,
                    budget: this.budget,
                    date: this.dateObj.toISOString(),
                    client_id: this.selectedClient.id,
                    users: this.selectedUsers,
                };

                if (this.editingItemId != null) {
                    resp = await ProjectController.updateItem(this.editingItemId, payload);
                } else {
                    resp = await ProjectController.storeItem(payload);
                }
                if (resp.message) {
                    this.$emit('saved');
                    this.clearForm();
                }
            } catch (error) {
                this.$emit('saved-error', this.getApiErrorMessage(error));
            }
            this.saveLoading = false;
        },
        async deleteItem() {
        },
        clearForm() {
            this.name = '';
            this.date = new Date().toISOString().substring(0, 16);
            this.budget = 0;
            this.selectedClient = null;
            this.selectedUsers = [];
            this.editingItemId = null;
            this.fetchUsers();
        },
        showDeleteDialog() {
            this.deleteDialog = true;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
        },
        async handleFileChange(event) {
            if (!this.editingItemId) {
                alert('Сначала сохраните проект, затем прикрепляйте файлы');
                event.target.value = '';
                return;
            }
            const files = event.target.files;
            if (!files.length) return;

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }

            this.uploading = true;
            try {
                const response = await api.post(`/projects/${this.editingItemId}/upload-files`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                this.files = response.data.files;
                event.target.value = '';
            } catch (e) {
                alert('Ошибка загрузки файлов');
            }
            this.uploading = false;
        },
        showDeleteFileDialog(index) {
            this.deleteFileIndex = index;
            this.deleteFileDialog = true;
        },
        closeDeleteFileDialog() {
            this.deleteFileDialog = false;
            this.deleteFileIndex = -1;
        },
        async confirmDeleteFile() {
            if (this.deleteFileIndex === -1 || !this.editingItemId) {
                this.closeDeleteFileDialog();
                return;
            }
            const file = this.files[this.deleteFileIndex];
            if (!file) {
                this.closeDeleteFileDialog();
                return;
            }
            try {
                const response = await api.post(`/projects/${this.editingItemId}/delete-file`, {
                    path: file.path
                });
                this.files = response.data.files;
            } catch (e) {
                alert('Ошибка удаления файла');
            }

            this.closeDeleteFileDialog();
        },
        async deleteFile(index) {
            if (!this.editingItemId) return;
            const file = this.files[index];
            if (!file) return;

            try {
                const response = await api.post(`/projects/${this.editingItemId}/delete-file`, {
                    path: file.path
                });
                this.files = response.data.files;
            } catch (e) {
                alert('Ошибка удаления файла');
            }
        },
    },
    watch: {
        editingItem: {
            handler(newEditingItem) {
                if (newEditingItem) {
                    this.name = newEditingItem.name || '';
                    this.budget = newEditingItem.budget || 0;
                    this.date = newEditingItem.date || '';
                    this.selectedClient = newEditingItem.client || null;
                    this.selectedUsers = Array.isArray(newEditingItem.users)
                        ? newEditingItem.users
                        : [];
                    this.editingItemId = newEditingItem.id || null;
                    this.files = newEditingItem.files || [];
                } else {
                    this.name = '';
                    this.date = '';
                    this.budget = 0;
                    this.selectedClient = null;
                    this.selectedUsers = [];
                    this.editingItemId = null;
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>