export interface AdminType {
    id: string
    email: string
    password: string
    isActive: boolean
    deleted_at: string
    created_at: string
    updated_at: string
}

export interface CreateAdminType extends Pick<AdminType, 'email' | 'password'> { }