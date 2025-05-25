'use client';

import React, { useState, useEffect } from 'react';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { User, getAllUsers, getUsersByRole, updateUserRole, updateUserActiveStatus, addSampleUser, updateUser } from '@/services/userService';
import { Skeleton } from '@/components/ui/Skeleton';

const roleColors = {
  'admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  'coreteam': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  'user': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
};

const roleBgColors = {
  'admin': 'bg-purple-500',
  'coreteam': 'bg-teal-500',
  'user': 'bg-blue-500'
};

const roleLabels = {
  'admin': 'Yönetici',
  'coreteam': 'CoreTeam',
  'user': 'Kullanıcı'
};

export default function UsersPage() {
  const { user, loading: authLoading } = useFirestoreAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'coreteam' | 'user'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleChangeLoading, setRoleChangeLoading] = useState<string | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Yeni kullanıcı formu için state
  const [newUserForm, setNewUserForm] = useState({
    displayName: '',
    email: '',
    role: 'user' as 'admin' | 'coreteam' | 'user',
    bio: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Kullanıcıları yükle
  useEffect(() => {
    if (!authLoading) {
      loadUsers();
    }
  }, [authLoading]);

  // Filtreler değiştiğinde kullanıcıları filtrele
  useEffect(() => {
    filterUsers();
  }, [selectedRole, searchTerm, users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      let fetchedUsers: User[];
      
      if (selectedRole === 'all') {
        fetchedUsers = await getAllUsers();
      } else {
        fetchedUsers = await getUsersByRole(selectedRole);
      }
      
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      console.log('Kullanıcılar yüklendi:', fetchedUsers.length);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      // Hata durumunda boş bir dizi ayarla
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Rol filtresi
    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole);
    }
    
    // Arama filtresi
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.displayName.toLowerCase().includes(term) || 
          user.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(result);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'coreteam' | 'user') => {
    try {
      setRoleChangeLoading(userId);
      await updateUserRole(userId, newRole);
      
      // Kullanıcı listesini güncelle
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Rol değiştirme işlemi başarısız:', error);
      alert('Rol değiştirme işlemi başarısız oldu.');
    } finally {
      setRoleChangeLoading(null);
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      setStatusChangeLoading(userId);
      await updateUserActiveStatus(userId, isActive);
      
      // Kullanıcı listesini güncelle
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
    } catch (error) {
      console.error('Durum değiştirme işlemi başarısız:', error);
      alert('Durum değiştirme işlemi başarısız oldu.');
    } finally {
      setStatusChangeLoading(null);
    }
  };

  // Örnek kullanıcı ekle
  const handleAddSampleUser = async () => {
    if (!user || isAddingUser) return;
    
    try {
      setIsAddingUser(true);
      
      // Rastgele rol seç
      const roles: Array<'admin' | 'coreteam' | 'user'> = ['coreteam', 'user'];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      
      // Örnek kullanıcı verileri
      const randomNum = Math.floor(Math.random() * 1000);
      const sampleUser = {
        displayName: `Test Kullanıcı ${randomNum}`,
        email: `test${randomNum}@example.com`,
        role: randomRole,
        bio: 'Bu bir test kullanıcısıdır.'
      };
      
      await addSampleUser(sampleUser);
      
      // Kullanıcı listesini yenile
      await loadUsers();
      
      alert(`Örnek kullanıcı eklendi: ${sampleUser.displayName}`);
    } catch (error) {
      console.error('Örnek kullanıcı eklenirken hata oluştu:', error);
      alert('Örnek kullanıcı eklenirken bir hata oluştu.');
    } finally {
      setIsAddingUser(false);
    }
  };

  // Modal açma fonksiyonu
  const openModal = (user: User | null = null) => {
    if (user) {
      // Düzenleme modu
      setIsEditMode(true);
      setSelectedUser(user);
      setNewUserForm({
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        bio: user.bio || '',
        isActive: user.isActive
      });
    } else {
      // Yeni kullanıcı modu
      setIsEditMode(false);
      setSelectedUser(null);
      setNewUserForm({
        displayName: '',
        email: '',
        role: 'user',
        bio: '',
        isActive: true,
      });
    }
    
    setIsModalOpen(true);
  };

  // Modal kapatma fonksiyonu
  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    // Form sıfırlama işlemi modal kapandıktan sonra yapılabilir
    setTimeout(() => {
      setNewUserForm({
        displayName: '',
        email: '',
        role: 'user',
        bio: '',
        isActive: true,
      });
      setIsEditMode(false);
      setSelectedUser(null);
    }, 300);
  };

  // Form değişikliklerini izle
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewUserForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Kullanıcı ekle veya güncelle
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserForm.displayName || !newUserForm.email) {
      alert('Lütfen isim ve e-posta alanlarını doldurunuz.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditMode && selectedUser) {
        // Kullanıcı güncelleme
        await updateUser(selectedUser.id, {
          displayName: newUserForm.displayName,
          email: newUserForm.email,
          role: newUserForm.role,
          bio: newUserForm.bio,
          isActive: newUserForm.isActive,
        });
        
        // Kullanıcı listesini güncelle
        setUsers(users.map(u => 
          u.id === selectedUser.id ? {
            ...u,
            displayName: newUserForm.displayName,
            email: newUserForm.email,
            role: newUserForm.role,
            bio: newUserForm.bio,
            isActive: newUserForm.isActive
          } : u
        ));
        
        // Filtrelenmiş kullanıcıları da güncelle
        setFilteredUsers(filteredUsers.map(u => 
          u.id === selectedUser.id ? {
            ...u,
            displayName: newUserForm.displayName,
            email: newUserForm.email,
            role: newUserForm.role,
            bio: newUserForm.bio,
            isActive: newUserForm.isActive
          } : u
        ));
        
        alert('Kullanıcı başarıyla güncellendi.');
      } else {
        // Yeni kullanıcı ekle
        await addSampleUser({
          displayName: newUserForm.displayName,
          email: newUserForm.email,
          role: newUserForm.role,
          bio: newUserForm.bio,
          isActive: newUserForm.isActive,
        });
        
        await loadUsers();
        alert('Kullanıcı başarıyla eklendi.');
      }
      
      // Modalı kapat
      setIsModalOpen(false);
      
      // Formu sıfırla
      setNewUserForm({
        displayName: '',
        email: '',
        role: 'user',
        bio: '',
        isActive: true,
      });
      setIsEditMode(false);
      setSelectedUser(null);
      
    } catch (error) {
      console.error('Kullanıcı işlemi sırasında hata oluştu:', error);
      alert('İşlem sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 shadow-lg rounded-lg mb-8 p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Kullanıcı Yönetimi</h1>
        <p className="text-blue-100 dark:text-blue-200">
          Tüm kullanıcıları görüntüleyin, düzenleyin ve yeni kullanıcılar ekleyin.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedRole === 'all'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
              }`}
            >
              Tümü
            </button>
            
            {Object.entries(roleLabels).map(([role, label]) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role as 'admin' | 'coreteam' | 'user')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRole === role
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-blue-300" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim veya e-posta ile ara"
              className="w-full sm:w-64 pl-10 pr-4 py-2 border-0 rounded-md text-sm text-white placeholder-blue-200 bg-blue-600/50 focus:ring-2 focus:ring-white focus:bg-blue-500/30 focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {filteredUsers.length} kullanıcı {selectedRole !== 'all' ? `(${roleLabels[selectedRole]})` : ''}
          {searchTerm && ` "${searchTerm}" araması için`}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Yeni kullanıcı ekleme butonu */}
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Yeni Kullanıcı Ekle
          </button>
          
          {/* Örnek kullanıcı ekleme butonu */}
          {user && (
            <button
              onClick={handleAddSampleUser}
              disabled={isAddingUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-green-400"
            >
              {isAddingUser ? 'Ekleniyor...' : 'Örnek Kullanıcı Ekle'}
            </button>
          )}
        </div>
      </div>
      
      {/* Kullanıcı Listesi */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <svg
              className="h-10 w-10 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {selectedRole === 'all'
              ? 'Hiç kullanıcı bulunamadı'
              : `${roleLabels[selectedRole]} rolünde kullanıcı bulunamadı`}
          </h3>
          <p className="mt-2 max-w-md mx-auto text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? 'Arama kriterlerinize uygun kullanıcı bulunamadı. Farklı bir arama terimi deneyin.'
              : 'Kullanıcı listesi boş görünüyor. Yukarıdaki "Yeni Kullanıcı Ekle" butonunu kullanarak kullanıcı ekleyebilirsiniz.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`h-3 ${roleBgColors[user.role]}`}></div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-semibold text-white" style={{backgroundColor: user.photoURL ? 'transparent' : roleBgColors[user.role]}}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {user.displayName}
                        </h3>
                        {!user.isActive && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Pasif
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mt-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </div>
                    
                    <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {user.createdAt.toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  
                  {user.bio && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {user.bio}
                    </div>
                  )}
                  
                  {/* Yeni buton alanı */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2">
                    {/* Düzenle butonu */}
                    <button 
                      onClick={() => openModal(user)}
                      className="flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Düzenle
                    </button>
                    
                    {/* Rol değiştir butonu */}
                    <div className="relative group">
                      <button 
                        className="w-full flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Rol
                      </button>
                      
                      {/* Açılır rol menüsü */}
                      <div className="absolute bottom-full left-0 mb-1 w-full rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                        {Object.entries(roleLabels).map(([role, label]) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(user.id, role as 'admin' | 'coreteam' | 'user')}
                            disabled={user.role === role || roleChangeLoading === user.id}
                            className={`block w-full text-left px-3 py-1.5 text-xs ${
                              user.role === role
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-default'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {roleChangeLoading === user.id ? 'İşleniyor...' : label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Aktiflik durumu butonu */}
                    <button 
                      onClick={() => handleStatusChange(user.id, !user.isActive)}
                      disabled={statusChangeLoading === user.id}
                      className={`flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                        user.isActive 
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {statusChangeLoading === user.id ? (
                        <svg className="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          {user.isActive ? (
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </>
                      )}
                      {user.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Yeni Kullanıcı Ekleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Arkaplan overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
              onClick={closeModal}
            />
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 px-4 py-3 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {isEditMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                  </h3>
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                <form onSubmit={handleSubmitUser}>
                  <div className="grid grid-cols-1 gap-y-4">
                    {/* İsim alanı */}
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        İsim
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        id="displayName"
                        value={newUserForm.displayName}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Kullanıcı adı"
                      />
                    </div>
                    
                    {/* E-posta alanı */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={newUserForm.email}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    
                    {/* Rol seçimi */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rol
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={newUserForm.role}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {Object.entries(roleLabels).map(([role, label]) => (
                          <option key={role} value={role}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Biyografi */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Biyografi
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={newUserForm.bio}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Kullanıcı hakkında kısa bilgi..."
                      />
                    </div>
                    
                    {/* Aktif/Pasif durumu */}
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={newUserForm.isActive}
                          onChange={(e) => setNewUserForm(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isActive" className="font-medium text-gray-700 dark:text-gray-300">
                          Kullanıcı aktif
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">Kullanıcının sisteme giriş yapabilmesi için aktif olması gerekir.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row-reverse sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:bg-blue-400 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Ekleniyor...
                        </>
                      ) : 'Kaydet'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isSubmitting}
                      className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-70 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 