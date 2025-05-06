'use client';

import React, { useState } from 'react';
import { Role } from './RoleList';

interface RoleFormProps {
  role?: Role;
  onSubmit: (role: Omit<Role, 'id'>) => void;
  onCancel: () => void;
}

export default function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [permissions, setPermissions] = useState<string[]>(role?.permissions || []);
  const [level, setLevel] = useState<number>(role?.level || 1);
  const [color, setColor] = useState(role?.color || '#3B82F6'); // blue-500 default

  // Örnek izinler listesi
  const allPermissions = [
    { id: 'events_create', label: 'Etkinlik Oluşturma' },
    { id: 'events_edit', label: 'Etkinlik Düzenleme' },
    { id: 'events_delete', label: 'Etkinlik Silme' },
    { id: 'clubs_create', label: 'Kulüp Oluşturma' },
    { id: 'clubs_edit', label: 'Kulüp Düzenleme' },
    { id: 'clubs_delete', label: 'Kulüp Silme' },
    { id: 'users_view', label: 'Kullanıcıları Görüntüleme' },
    { id: 'users_edit', label: 'Kullanıcı Düzenleme' },
    { id: 'roles_manage', label: 'Rolleri Yönetme' },
  ];

  const handlePermissionChange = (permissionId: string) => {
    if (permissions.includes(permissionId)) {
      setPermissions(permissions.filter(id => id !== permissionId));
    } else {
      setPermissions([...permissions, permissionId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      description,
      permissions,
      level,
      color,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol Adı
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Açıklama
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seviye (Yetki Düzeyi)
                </label>
                <input
                  type="number"
                  id="level"
                  min="1"
                  max="10"
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  1 (En düşük) - 10 (En yüksek) arası yetki düzeyi
                </p>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Renk
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İzinler
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 overflow-y-auto max-h-60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        id={`permission-${permission.id}`}
                        type="checkbox"
                        checked={permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {role ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 