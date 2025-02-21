import dayjs from "dayjs";
import ClientPhoneDto from "./ClientPhoneDto";
import ClientEmailDto from "./ClientEmailDto";

// ClientDto описывает структуру клиента
export default class ClientDto {
    constructor(id, clientType, isSupplier, isConflict, firstName, lastName, contactPerson, address, note, status, createdAt, updatedAt, emails = [], phones = []) {
        this.id = id; // Идентификатор клиента
        this.clientType = clientType; // Тип клиента
        this.isSupplier = (isSupplier == 1 || isSupplier == '1' || isSupplier == true) ? true : false; // Является ли поставщиком
        this.isConflict = (isConflict == 1 || isConflict == '1' || isConflict == true) ? true : false; // Является ли конфликтным
        this.firstName = firstName; // Имя клиента
        this.lastName = lastName; // Фамилия клиента
        this.contactPerson = contactPerson; // Контактное лицо
        this.address = address; // Адрес клиента
        this.note = note; // Заметка
        this.status = (status == 1 || status == '1' || status == true) ? true : false; // Статус клиента
        this.createdAt = createdAt; // Дата создания клиента
        this.updatedAt = updatedAt; // Дата обновления клиента
        this.emails = emails.map(email => new ClientEmailDto(email.id, email.client_id, email.email)); // Список email-ов
        this.phones = phones.map(phone => new ClientPhoneDto(phone.id, phone.client_id, phone.phone)); // Список телефонов
    }

    icons() {
        var res = '';
        if (this.clientType === 'company') {
            res += '<i class="fas fa-building text-[#3571A4] mr-2" title="Компания"></i>';
        } else {
            res += '<i class="fas fa-user text-[#3571A4] mr-2" title="Индивидульный клиент"></i>';
        }
        if (this.isConflict) {
            res += '<i class="fas fa-exclamation-triangle text-[#D53935] mr-2" title="Проблемный клиент"></i>';
        }
        if (this.isSupplier) {
            res += '<i class="fas fa-truck text-[#3571A4] mr-2" title="Поставщик"></i>';
        }
        return res;
    }

    statusIcon() {
        if (this.status === true || this.status === '1') {
            return '<i class="fas fa-circle-check text-[#5CB85C]" title="Активен"></i>';
        } else {
            return '<i class="fas fa-times text-[#D53935]" title="Неактивен"></i>';
        }
    }

    phonesHtmlList(){
        var res = '<ul>';
        this.phones.forEach(phone => {
            res += `<li>${phone.phone}</li>`;
        });
        res += '</ul>';
        return res;
    }
    emailsHtmlList(){
        var res = '<ul>';
        this.emails.forEach(email => {
            res += `<li>${email.email}</li>`;
        });
        res += '</ul>';
        return res;
    }

    formatCreatedAt() {
        return dayjs(this.createdAt).format('YYYY-MM-DD');
    }

    formatUpdatedAt() {
        return dayjs(this.updatedAt).format('YYYY-MM-DD');
    }
}