export const ADMIN_DASHBOARD = '/auth/admin/dashboard'
export const ADMIN_MEDIA = '/auth/admin/media'


//category
export const ADMIN_CATEGORY_ADD = '/auth/admin/category/add'
export const ADMIN_CATEGORY_SHOW = '/auth/admin/category'
export const ADMIN_CATEGORY_EDIT = (id) => id ? `/auth/admin/category/edit/${id}` : ''