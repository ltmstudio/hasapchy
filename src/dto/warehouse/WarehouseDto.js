import dayjs from "dayjs";

// WarehouseDto описывает структуру склада
export default class WarehouseDto {
    constructor(id, name, users = [], createdAt = '', updatedAt = '') {
        this.id = id; // Идентификатор склада
        this.name = name; // Название склада
        this.users = users; // Список пользователей (идентификаторы)
        this.createdAt = createdAt; // Дата создания склада
        this.updatedAt = updatedAt; // Дата обновления склада
    }

    formatCreatedAt() {
        return dayjs(this.createdAt).format('YYYY-MM-DD');
    }
}