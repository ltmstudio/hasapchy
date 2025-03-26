import PaginatedResponse from '@/dto/app/PaginatedResponseDto';
import api from './axiosInstance';
import ClientDto from '@/dto/client/ClientDto';
import ProjectDto from '@/dto/project/ProjectDto';

export default class ProjectController {
    static async getItems(page = 1) {
        try {
            const response = await api.get(`/projects?page=${page}`);
            const data = response.data;
            console.log(data);
            // Преобразуем полученные данные в DTO
            const items = data.items.map(item => {
                var client = null;
                if (item.client) {
                    client = new ClientDto(
                        item.client.id,
                        item.client.client_type,
                        item.client.balance,
                        item.client.is_supplier,
                        item.client.is_conflict,
                        item.client.first_name,
                        item.client.last_name,
                        item.client.contact_person,
                        item.client.address,
                        item.client.note,
                        item.client.status,
                        item.client.created_at,
                        item.client.updated_at,
                        item.client.emails,
                        item.client.phones,
                    );
                }
                return new ProjectDto(
                    item.id,
                    item.name,
                    item.budget,
                    item.date,
                    item.client_id,
                    client,
                    item.user_id,
                    item.user_name,
                    item.users,
                    item.created_at,
                    item.updated_at,
                );
            });

            const paginatedResponse = new PaginatedResponse(items, data.current_page, data.next_page, data.last_page, data.total);

            return paginatedResponse;
        } catch (error) {
            console.error('Ошибка при получении проектов:', error);
            throw error;
        }
    }

    static async getAllItems() {
        try {
            const response = await api.get(`/projects/all`);
            const data = response.data;
            console.log(data);
            // Преобразуем полученные данные в DTO
            const items = data.map(item => {
                var client = null;
                if (item.client) {
                    client = new ClientDto(
                        item.client.id,
                        item.client.client_type,
                        item.client.balance,
                        item.client.is_supplier,
                        item.client.is_conflict,
                        item.client.first_name,
                        item.client.last_name,
                        item.client.contact_person,
                        item.client.address,
                        item.client.note,
                        item.client.status,
                        item.client.created_at,
                        item.client.updated_at,
                        item.client.emails,
                        item.client.phones,
                    );
                }
                return new ProjectDto(
                    item.id,
                    item.name,
                    item.budget,
                    item.date,
                    item.client_id,
                    client,
                    item.user_id,
                    item.user_name,
                    item.users,
                    item.created_at,
                    item.updated_at
                );
            });
            return items;
        } catch (error) {
            console.error('Ошибка при получении всего списка проектов:', error);
            throw error;
        }
    }

    static async storeItem(item) {
        try {
            const { data } = await api.post('/projects', item);
            return data;
        } catch (error) {
            console.error('Ошибка при создании проекта:', error);
            throw error;
        }
    }

    static async updateItem(id, item) {
        try {
            const { data } = await api.put(`/projects/${id}`, item);
            return data;
        } catch (error) {
            console.error('Ошибка при обновлении проекта:', error);
            throw error;
        }
    }

    // static async deleteItem(id) {
    //     try {
    //         const { data } = await api.delete(`/categories/${id}`);
    //         return data;
    //     } catch (error) {
    //         console.error('Ошибка при удалении категории:', error);
    //         throw error;
    //     }
    // }
}