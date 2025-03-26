import PaginatedResponse from '@/dto/app/PaginatedResponseDto';
import api from './axiosInstance';
import ClientDto from '@/dto/client/ClientDto';
import TransactionDto from '@/dto/transaction/TransactionDto';

export default class TransactionController {
    static async getItems(page = 1, cash_id = null, date_filter_type = 'all_time') {
        try {
            const response = await api.get('/transactions', {
                params: {
                    page: page,
                    cash_id: cash_id,
                    date_filter_type: date_filter_type
                }
            });
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
                return new TransactionDto(
                    item.id,
                    item.type,
                    item.is_transfer,
                    item.cash_id,
                    item.cash_name,
                    item.cash_amount,
                    item.cash_currency_id,
                    item.cash_currency_name,
                    item.cash_currency_code,
                    item.cash_currency_symbol,
                    item.orig_amount,
                    item.orig_currency_id,
                    item.orig_currency_name,
                    item.orig_currency_code,
                    item.orig_currency_symbol,
                    item.user_id,
                    item.user_name,
                    item.category_id,
                    item.category_name,
                    item.category_type,
                    item.project_id,
                    item.project_name,
                    item.client_id,
                    client,
                    item.note,
                    item.date,
                    item.created_at,
                    item.updated_at
                );
            });

            const paginatedResponse = new PaginatedResponse(items, data.current_page, data.next_page, data.last_page, data.total);

            return paginatedResponse;
        } catch (error) {
            console.error('Ошибка при получении транзакций:', error);
            throw error;
        }
    }

    // static async getAllItems() {
    //     try {
    //         const response = await api.get(`/categories/all`);
    //         const data = response.data;
    //         console.log(data);
    //         // Преобразуем полученные данные в DTO
    //         const items = data.map(item => {
    //             return new CategoryDto(
    //                 item.id,
    //                 item.name,
    //                 item.parent_id,
    //                 item.parent_name,
    //                 item.user_id,
    //                 item.user_name,
    //                 item.users,
    //                 item.created_at,
    //                 item.updated_at,
    //             );
    //         });
    //         return items;
    //     } catch (error) {
    //         console.error('Ошибка при получении категорий:', error);
    //         throw error;
    //     }
    // }

    static async storeItem(item) {
        try {
            const { data } = await api.post('/transactions', item);
            return data;
        } catch (error) {
            console.error('Ошибка при создании транзакции:', error);
            throw error;
        }
    }

    static async updateItem(id, item) {
        try {
            const { data } = await api.put(`/transactions/${id}`, item);
            return data;
        } catch (error) {
            console.error('Ошибка при обновлении транзакции:', error);
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