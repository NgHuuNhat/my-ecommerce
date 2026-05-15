'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

// FIX HYDRATION
const Slide = dynamic(() => import('./components/silde/page'), {
  ssr: false
})

const Brand = dynamic(() => import('./components/brand/page'), {
  ssr: false
})

const techImages = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef'
]

// const techImages = [
//   'https://placehold.co/600x600/png?text=iPhone',
//   'https://placehold.co/600x600/png?text=MacBook',
//   'https://placehold.co/600x600/png?text=AirPods',
//   'https://placehold.co/600x600/png?text=Apple+Watch',
//   'https://placehold.co/600x600/png?text=Gaming',
//   'https://placehold.co/600x600/png?text=Keyboard',
//   'https://placehold.co/600x600/png?text=Monitor',
//   'https://placehold.co/600x600/png?text=Tablet'
// ]

const getImage = (index: number) => {
  return techImages[index % techImages.length]
}

const categories = [
  'Điện thoại',
  'Laptop',
  'Tablet',
  'Tai nghe',
  'Gaming',
  'Camera',
  'Phụ kiện',
  'Đồng hồ'
]

const flashSaleProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: '28.990.000đ',
    image: getImage(0)
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    price: '31.490.000đ',
    image: getImage(1)
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    price: '5.990.000đ',
    image: getImage(2)
  },
  {
    id: 4,
    name: 'Apple Watch Ultra',
    price: '19.990.000đ',
    image: getImage(3)
  }
]

const products = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  name: `Sản phẩm công nghệ ${index + 1}`,
  price: `${(index + 2) * 1_000_000}đ`,
  image: getImage(index)
}))

export default function HomePage() {
  return (
    <div className='min-h-screen bg-[#f5f5f5]'>
      <main className='space-y-6 pb-10'>
        {/* SLIDE */}
        <div className='container mx-auto px-4 pt-4'>
          <Slide />
        </div>

        {/* CATEGORY */}
        <section className='container mx-auto px-4 max-w-7xl'>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8'>
            {categories.map((item) => (
              <button
                key={item}
                className='rounded-2xl border bg-white p-4 text-sm font-medium transition hover:-translate-y-1 hover:shadow-md'
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* FLASH SALE */}
        <section className='container mx-auto px-4 max-w-7xl'>
          <div className='rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-5'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-white'>
                  Flash Sale
                </h2>

                <p className='text-sm text-orange-100'>
                  Giảm giá cực mạnh hôm nay
                </p>
              </div>

              <Button variant='secondary'>
                Xem tất cả
              </Button>
            </div>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {flashSaleProducts.map((product) => (
                <Card
                  key={product.id}
                  className='overflow-hidden rounded-2xl border-0'
                >
                  <div className='relative h-52 w-full bg-gray-100'>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes='100vw'
                      className='object-cover'
                    />
                  </div>

                  <CardContent className='space-y-2 p-4'>
                    <Badge>HOT</Badge>

                    <h3 className='line-clamp-2 font-medium'>
                      {product.name}
                    </h3>

                    <p className='text-lg font-bold text-red-500'>
                      {product.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND */}
        <section className='container mx-auto px-4'>
          <Brand />
        </section>

        {/* PRODUCTS */}
        <section className='container mx-auto px-4 max-w-7xl'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>
                Gợi ý hôm nay
              </h2>

              <p className='text-muted-foreground'>
                Sản phẩm dành cho bạn
              </p>
            </div>

            <Button variant='outline'>
              Xem thêm
            </Button>
          </div>

          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
            {products.map((product) => (
              <Card
                key={product.id}
                className='group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg'
              >
                <CardHeader className='p-0'>
                  <div className='relative h-52 w-full overflow-hidden bg-gray-100'>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes='100vw'
                      className='object-cover transition duration-300 group-hover:scale-105'
                    />
                  </div>
                </CardHeader>

                <CardContent className='space-y-2 p-4'>
                  <CardTitle className='line-clamp-2 text-sm font-medium'>
                    {product.name}
                  </CardTitle>

                  <p className='text-lg font-bold text-red-500'>
                    {product.price}
                  </p>
                </CardContent>

                <CardFooter className='p-4 pt-0'>
                  <Button className='w-full rounded-xl'>
                    Thêm vào giỏ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* BANNER */}
        <section className='container mx-auto px-4 max-w-7xl'>
          <div className='rounded-3xl bg-black px-6 py-10 text-center text-white'>
            <h2 className='mb-3 text-3xl font-bold'>
              Mega Sale 5.5
            </h2>

            <p className='mx-auto mb-5 max-w-2xl text-sm text-gray-300'>
              Deal công nghệ, phụ kiện, gaming gear giảm đến 70%.
            </p>

            <Button
              size='lg'
              className='rounded-2xl'
            >
              Mua ngay
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}