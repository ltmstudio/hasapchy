<template>
    <div class="flex flex-col overflow-auto h-full p-4">
        <h2 class="text-lg font-bold mb-4">Проект</h2>
        <TabBar :tabs="tabs" :active-tab="currentTab" :tab-click="(t) => { currentTab = t }" />
        <div v-show="currentTab === 'info'">
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
                <label class="required">Назначить пользователей</label>
                <div v-if="users != null && users.length != 0" class="flex flex-wrap gap-2">
                    <label v-for="user in users" :key="user.id"
                        class="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded">
                        <input type="checkbox" :value="user.id.toString()" v-model="selectedUsers"
                            :id="'user-' + user.id" />
                        <span class="text-black">{{ user.name }}</span>
                    </label>
                </div>
            </div>
        </div>
        <div v-show="currentTab === 'files'">
            <label>Файлы</label>
            <input type="file" multiple @change="handleFileChange" />
            <ul v-if="editingItem">
                <li v-for="file in editingItem.getFormattedFiles()" :key="file.path" class="flex items-center gap-2">
                    <i :class="file.icon"></i>
                    <a :href="file.url" target="_blank" download class="text-blue-600 hover:underline">{{ file.name
                    }}</a>
                    <button @click="showDeleteFileDialogByPath(file.path)" class="text-red-500">Удалить</button>
                </li>
            </ul>
        </div>
        <div v-show="currentTab === 'balance'">
            <ProjectBalanceTab v-if="editingItem" :editing-item="editingItem" />
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
import TabBar from '@/views/components/app/forms/TabBar.vue';
import ProjectDto from '@/dto/project/ProjectDto';
import PrimaryButton from '@/views/components/app/buttons/PrimaryButton.vue';
import AlertDialog from '@/views/components/app/dialog/AlertDialog.vue';
import ProjectController from '@/api/ProjectController';
import api from '@/api/axiosInstance';
import ClientSearch from '@/views/components/app/search/ClientSearch.vue';
import getApiErrorMessage from '@/mixins/getApiErrorMessageMixin';
import ProjectBalanceTab from '@/views/pages/projects/ProjectBalanceTab.vue';

export default {
    mixins: [getApiErrorMessage],
    emits: ['saved', 'saved-error', 'deleted', 'deleted-error'],
    components: { PrimaryButton, AlertDialog, TabBar, ClientSearch, ProjectBalanceTab },
    props: {
        editingItem: { type: ProjectDto, required: false, default: null }
    },
    data() {
        return {
            name: this.editingItem ? this.editingItem.name : '',
            budget: this.editingItem ? this.editingItem.budget : 0,
            date: this.editingItem && this.editingItem.date
                ? new Date(this.editingItem.date).toISOString().substring(0, 16)
                : new Date().toISOString().substring(0, 16),
            selectedUsers: [],
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
            currentTab: 'info',
            tabs: [
                { name: 'info', label: 'Информация' },
                { name: 'files', label: 'Файлы' },
                { name: "balance", label: "Баланс" },
            ],
        }
    },
    created() {
        this.fetchUsers()
    },
    methods: {
        async fetchUsers() {
            this.users = await UsersController.getAllUsers();

            if (this.editingItem && Array.isArray(this.editingItem.users)) {
                this.selectedUsers = this.editingItem.users
                    .filter(u => u && u.id != null)
                    .map(u => u.id.toString());
            }
        },
        async save() {
            if (this.uploading) {
                alert('Дождитесь завершения загрузки файлов');
                return;
            }
            this.saveLoading = true;
            try {
                let resp;
                const formData = {
                    name: this.name,
                    budget: this.budget,
                    date: new Date(this.date).toISOString(),
                    client_id: this.selectedClient?.id,
                    users: this.selectedUsers,
                };

                if (this.editingItemId != null) {
                    resp = await ProjectController.updateItem(this.editingItemId, formData);
                } else {
                    resp = await ProjectController.storeItem(formData);
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
            this.budget = 0;
            this.date = new Date().toISOString().substring(0, 16);
            this.selectedClient = null;
            this.selectedUsers = [];
            this.files = [];
            this.editingItemId = null;
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

            this.uploading = true;
            try {
                this.files = await ProjectController.uploadFiles(this.editingItemId, files);
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
            if (this.deleteFileIndex === -1 || !this.editingItemId) return;
            const file = this.files[this.deleteFileIndex];
            if (!file) return;

            try {
                this.files = await ProjectController.deleteFile(this.editingItemId, file.path);
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
                    this.date = newEditingItem.date
                        ? new Date(newEditingItem.date).toISOString().substring(0, 16)
                        : new Date().toISOString().substring(0, 16);
                    this.selectedClient = newEditingItem.client || null;
                    this.selectedUsers = Array.isArray(newEditingItem.users)
                        ? newEditingItem.users.map(u => u.toString?.() || u.id?.toString?.()).filter(Boolean)
                        : [];
                    this.files = newEditingItem.files || [];
                    this.editingItemId = newEditingItem.id || null;
                } else {
                    this.date = new Date().toISOString().substring(0, 16);
                    this.clearForm();
                }
            },
            deep: true,
            immediate: true
        }
    }

}
</script>