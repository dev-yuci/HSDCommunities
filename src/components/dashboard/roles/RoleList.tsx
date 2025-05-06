'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RoleForm from './RoleForm';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
  color: string;
}

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Yönetici',
    description: 'Tam yetkili yönetici rolü. Tüm sistemde her işlemi yapabilir.',
    permissions: [
      'events_create', 'events_edit', 'events_delete',
      'clubs_create', 'clubs_edit', 'clubs_delete',
      'users_view', 'users_edit', 'roles_manage'
    ],
    level: 10,
    color: '#EF4444', // red-500
  },
  {
    id: '2',
    name: 'Moderatör',
    description: 'Etkinlik ve kulüpleri yönetebilir, kullanıcıları görüntüleyebilir.',
    permissions: [
      'events_create', 'events_edit', 'events_delete',
      'clubs_create', 'clubs_edit', 'clubs_delete',
      'users_view'
    ],
    level: 7,
    color: '#F59E0B', // amber-500
  },
  {
    id: '3',
    name: 'Kulüp Yöneticisi',
    description: 'Kulüp bilgilerini düzenleyebilir ve etkinlik ekleyebilir.',
    permissions: [
      'events_create', 'events_edit',
      'clubs_edit'
    ],
    level: 5,
    color: '#3B82F6', // blue-500
  },
  {
    id: '4',
    name: 'Üye',
    description: 'Temel üye rolü. Sınırlı izinlere sahiptir.',
    permissions: [],
    level: 1,
    color: '#10B981', // emerald-500
  },
];

export default function RoleList() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  const handleAddRole = (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      id: uuidv4(),
      ...roleData,
    };

    setRoles([...roles, newRole]);
    setIsFormOpen(false);
  };

  const handleEditRole = (roleData: Omit<Role, 'id'>) => {
    if (!editingRole) return;

    setRoles(
      roles.map((role) =>
        role.id === editingRole.id
          ? { ...role, ...roleData }
          : role
      )
    );

    setEditingRole(undefined);
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const startEdit = (role: Role) => {
    setEditingRole(role);
  };

  const cancelEdit = () => {
    setEditingRole(undefined);
    setIsFormOpen(false);
  };

  // İzin etiketleri için lookup tablosu
  const permissionLabels: { [key: string]: string } = {
    'events_create': 'Etkinlik Oluşturma',
    'events_edit': 'Etkinlik Düzenleme',
    'events_delete': 'Etkinlik Silme',
    'clubs_create': 'Kulüp Oluşturma',
    'clubs_edit': 'Kulüp Düzenleme',
    'clubs_delete': 'Kulüp Silme',
    'users_view': 'Kullanıcıları Görüntüleme',
    'users_edit': 'Kullanıcı Düzenleme',
    'roles_manage': 'Rolleri Yönetme',
  };

  return (
    <div>
      {(isFormOpen || editingRole) && (
        <div className="mb-8">
          <RoleForm
            role={editingRole}
            onSubmit={editingRole ? handleEditRole : handleAddRole}
            onCancel={cancelEdit}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Roller ({roles.length})
        </h3>
        
        {!isFormOpen && !editingRole && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Rol
          </button>
        )}
      </div>

      <div className="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Rol
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Açıklama
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Seviye
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                İzinler
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full mr-3" style={{ backgroundColor: role.color }}></div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {role.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {role.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {role.level}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.length === 0 ? (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        İzin yok
                      </span>
                    ) : (
                      role.permissions.slice(0, 3).map((permission) => (
                        <span
                          key={permission}
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {permissionLabels[permission] || permission}
                        </span>
                      ))
                    )}
                    {role.permissions.length > 3 && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        +{role.permissions.length - 3} daha
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    onClick={() => startEdit(role)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => handleDelete(role.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Henüz rol bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 