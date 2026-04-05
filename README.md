## Web: e-commerce
## Tech: 
- Front-end: Next.js (App Router), React, TypeScript, Tailwind CSS, Shadcn UI, React Hook Form.
- Back-end: Next.js API Routes (Route Handlers), NextAuth.js, Zod (Validation).
- Database & Cloud: Firebase (Firestore, Authentication), Google Cloud Platform.
- Tools & Others: Git/GitHub, VS Code, Postman.

## Features:
### Admin panel ("/admin")
- Managers management (admins)
- Categories management
- Products management
- Couponts management
- Users management
- Orders management
### Customer ("/")
- Homepage (All products pagination, categories list)
- Category detail
- Product Detail
- Cart
- Payment
- Order status

## DB design
### Admins (managers)
- email: string
- password: string
- isActive: boolean
- deleted_at: string
- created_at: string
- updated_at: string

### Categories
- name: string
- slug: string
- description: string // html
- deleted_at: string
- created_at: string
- updated_at: string

### Products
- name: string
- slug: string
- description: string // html
- created_by: AdminRef
- images: string[] // url to storage firebase
- categories: Array<'CategoriesRef'>
    ### Categories
    - id: string
    - name: string
    - slug: string
    - description: string // html
- properties
    ### Properties
    - name: string
    - color: string
    - size: string
    - price: number

### Coupons
- name: string
- code: string
- expried_at: string
- percent: number (%)
- stripe_id: string

### Users
- email: string
- google_id: string // or token
- facebook_id:string // or token
- first_name: string
- last_name: string
- avt: string // url to storage firebase

### Cart
- user: UserRef
- products: Array<'ProductRef'>

### Orders
- user: UserRef
- products: Array<'ProductRef'>
- coupon: CounponRef
- total: number
- stripe_invoice_id: string
- status: string