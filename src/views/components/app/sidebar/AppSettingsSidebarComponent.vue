<template>
    <div id="settings-sidebar"
        class="w-50 bg-[#53585C] text-white flex-shrink-0 transform transition-transform duration-300">
        <div>
            <div class="mb-5"></div>
            <!-- <h2 class="text-lg font-semibold mb-4 p-2">Настройки</h2> -->
            <ul>
                <SidebarLink to="/admin/cash-registers" icon="fa-solid fa-cash-register mr-2" :settings="true">
                    Кассы
                </SidebarLink>
            </ul>
            <ul>
                <SidebarLink to="/admin/warehouses" icon="fa-solid fa-warehouse mr-2" :settings="true">
                    Склады
                </SidebarLink>
            </ul>
            <ul>
                <SidebarLink to="/admin/categories" icon="fa-solid fa-list-alt mr-2" :settings="true">
                    Категории товара/услуг
                </SidebarLink>
            </ul>
            <ul>
                <SidebarLink to="/admin/products" icon="fa-solid fa-box mr-2" :settings="true">
                    Товары
                </SidebarLink>
            </ul>
            <ul>
                <SidebarLink to="/admin/services" icon="fa-solid fa-paint-roller mr-2" :settings="true">
                    Услуги
                </SidebarLink>
            </ul>
            <!-- <ul> -->
            <!-- @if (Auth::user()->hasPermission('view_users'))
                <li class="mb-2">
                    <a href="{{ route('admin.users.index') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.users.index') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-users mr-2"></i> Пользователи
                    </a>
                </li>
                @endif

                @if (Auth::user()->hasPermission('view_roles'))
                <li class="mb-2">
                    <a href="{{ route('admin.roles.index') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.roles.index') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-user-shield mr-2"></i> Роли
                    </a>
                </li>
                @endif
                @if (Auth::user()->hasPermission('view_products'))
                <li class="mb-2">
                    <a href="{{ route('admin.products.index') }}"
                        class="flex items-center p-2  hover:bg-gray-700  {{ request()->routeIs('admin.products.index') ? 'bg-gray-700 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-box mr-2"></i> Товары
                    </a>
                </li>
                @endif
                @if (Auth::user()->hasPermission('view_services'))
                <li class="mb-2">
                    <a href="{{ route('admin.services.index') }}"
                        class="flex items-center p-2  hover:bg-gray-700  {{ request()->routeIs('admin.services.index') ? 'bg-gray-700 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-concierge-bell mr-2"></i> Услуги
                    </a>
                </li>
                @endif
                @if (Auth::user()->hasPermission('view_warehouses'))
                <li class="mb-2">
                    <a href="{{ route('admin.warehouses.index') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.warehouses.index') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fa-solid fa-warehouse mr-2"></i> Склады
                    </a>
                </li>
                @endif
                @if (Auth::user()->hasPermission('view_expense_items'))
                <li class="mb-2">
                    <a href="{{ route('admin.transaction_categories.create') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.transaction_categories.create') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-list-alt mr-2"></i> Статьи расхода
                    </a>
                </li>
                @endif
                @if (Auth::user()->hasPermission('view_categories'))
                <li class="mb-2">
                    <a href="{{ route('admin.categories.index') }}"
                        class="flex items-center p-2  hover:bg-gray-700 {{ request()->routeIs('admin.categories.index') ? 'bg-gray-700 border-l-2 border-red-500' : '' }}">
                        <i class="fa fa-list-alt mr-2"></i> Категории
                    </a>
                </li>
                @endif
                {{ -- @if (Auth:: user() -> hasPermission('view_general_settings'))--}}
                <li class="mb-2">
                    <a href="{{ route('admin.settings.index') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.settings.index') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-cogs mr-2"></i> Общие настройки
                    </a>
                </li>
                {{ -- @endif --}}
                @if (Auth::user()->hasPermission('view_currencies'))
                <li class="mb-2">
                    <a href="{{ route('admin.currencies.index') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.currencies.index') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-dollar-sign mr-2"></i> Валюты
                    </a>
                </li>
                @endif

                <li class="mb-2">
                    <a href="{{ route('admin.order-statuses') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.order-statuses') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-tasks mr-2"></i> Статусы заказов
                    </a>
                </li>

                <li class="mb-2">
                    <a href="{{ route('admin.order-categories') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.order-categories') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-tags mr-2"></i> Категории заказов
                    </a>
                </li>

                <li class="mb-2">
                    <a href="{{ route('admin.order-status-categories') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.order-status-categories') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-layer-group mr-2"></i> Категории статусов заказов
                    </a>
                </li>

                <li class="mb-2">
                    <a href="{{ route('admin.orders.af') }}"
                        class="flex items-center p-2  hover:bg-gray-600 {{ request()->routeIs('admin.orders.af') ? 'bg-gray-600 border-l-2 border-red-500' : '' }}">
                        <i class="fas fa-shopping-basket mr-2"></i> Поля для заказов
                    </a>
                </li> -->

            <!-- </ul> -->
        </div>
    </div>
</template>
<script>
import SidebarLink from './SidebarLink.vue';
export default {
    components: {
        SidebarLink
    }
}
</script>
