export const ADMIN_DASHBOARD = '/auth/admin/dashboard'
export const ADMIN_MEDIA = '/auth/admin/media'
export const ADMIN_MEDIA_EDIT = (id) => id ? `/auth/admin/media/edit/${id}` : ''


//category
export const ADMIN_CATEGORY_ADD = '/auth/admin/category/add'
export const ADMIN_CATEGORY_SHOW = '/auth/admin/category'
export const ADMIN_CATEGORY_EDIT = (id) => id ? `/auth/admin/category/edit/${id}` : ''

//product
export const ADMIN_PRODUCT_ADD = '/auth/admin/product/add'
export const ADMIN_PRODUCT_SHOW = '/auth/admin/product'
export const ADMIN_PRODUCT_EDIT = (id) => id ? `/auth/admin/product/edit/${id}` : ''


export const ADMIN_TRASH = '/auth/admin/trash'