import { PageRequest } from './dto/page.request.ts'
import { BannerDto } from './dto/banner.dto.ts'
import { PageResponse } from './dto/page.response.ts'

class BannerService {


    private readonly BANNER_KEY = 'banners'


    constructor() {
        this.initializeSampleData()
    }

    private initializeSampleData() {
        const existingBanners = this.listBanners()
        if (existingBanners.length === 0) {
            console.log('Adding sample banners to localStorage...')
            const sampleBanners: BannerDto[] = [
                {
                    id: '1',
                    link: '/summer-sale',
                    imageUrl: 'https://picsum.photos/600/300?1'
                },
                {
                    id: '2',
                    link: '/winter-collection',
                    imageUrl: 'https://picsum.photos/600/300?2'
                },
                {
                    id: '3',
                    link: '/clearance',
                    imageUrl: 'https://picsum.photos/600/300?3'
                },
                {
                    id: '4',
                    link: '/new-arrivals',
                    imageUrl: 'https://picsum.photos/600/300?4'
                },
                {
                    id: '5',
                    link: '/special-offer',
                    imageUrl: 'https://picsum.photos/600/300?5'
                },
                {
                    id: '6',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '7',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '8',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '9',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '10',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '11',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '12',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '13',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '14',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '15',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '16',
                    link: '/featured',
                    imageUrl: 'https://picsum.photos/600/300?6'
                },
                {
                    id: '17',
                    link: '/summer-sale',
                    imageUrl: 'https://picsum.photos/600/300?1'
                },
                {
                    id: '18',
                    link: '/summer-sale',
                    imageUrl: 'https://picsum.photos/600/300?1'
                },
                {
                    id: '19',
                    link: '/summer-sale',
                    imageUrl: 'https://picsum.photos/600/300?1'
                },
                {
                    id: '20',
                    link: '/summer-sale',
                    imageUrl: 'https://picsum.photos/600/300?1'
                },
                {
                    id: '21',
                    link: '/summer-sale',
                    imageUrl: 'https://picsum.photos/600/300?1'
                },

            ]
            this.saveBanners(sampleBanners)
        }
    }



    async getBanners(page: PageRequest) {
        //defaults
        if (!page.page) page.page = 0
        if (!page.pageSize) page.pageSize = 12

        let banners = this.listBanners()
        console.log('bannerservice returning banners:', banners)

        const total = banners.length

        // if Sorting do before slicing 
        if (page.orderBy) {
            banners = banners.sort((a, b) => {
                const valueA = (Object.entries(a).find(value => value[0] === page.orderBy) || [])[1]
                const valueB = (Object.entries(b).find(value => value[0] === page.orderBy) || [])[1]
                if (valueA < valueB) return -1
                if (valueA > valueB) return 1
                return 0
            })
            if (page.orderType === 'desc') {
                banners = banners.reverse()
            }
        }

        banners = banners.slice(page.page * page.pageSize, (page.page + 1) * page.pageSize)


        return {
            content: banners,
            pageSize: page.pageSize,
            pageNumber: page.page,
            maxPageNumber: Math.floor(total / page.pageSize),
        } as PageResponse<BannerDto>
    }

    private getNextId(): string {
        const banners = this.listBanners()

        if (banners.length === 0) {
            return '1'
        }

        const numericIds = banners
            .map(banner => banner.id)
            .filter(id => id !== undefined)
            .map(id => parseInt(id!))
            .filter(id => !isNaN(id))

        if (numericIds.length === 0) {
            return '1'
        }

        const maxId = Math.max(...numericIds)
        return (maxId + 1).toString()
    }

    async createBanner(banner: BannerDto) {
        const banners = this.listBanners()
        const newBanner = {
            ...banner,
            id: this.getNextId()
        }
        this.saveBanners([newBanner, ...banners])
        return newBanner
    }


    async getBanner(id: string) {
        return this.listBanners().find(banner => banner.id === id)
    }

    async updateBanner(id: string, banner: BannerDto) {
        const banners = this.listBanners()
        const index = banners.findIndex(b => b.id === id)

        if (index === -1) {
            throw new Error(`Banner with id ${id} not found`)
        }

        banners[index] = {
            ...banner,
            id: id
        }
        this.saveBanners(banners)
        return banners[index]
    }

    async deleteBanner(id: string) {
        const banners = this.listBanners()
        const filteredBanners = banners.filter(banner => banner.id !== id)
        this.saveBanners(filteredBanners)
    }

    private listBanners() {
        return JSON.parse(localStorage.getItem(this.BANNER_KEY) || '[]') as BannerDto[]
    }

    private saveBanners(banners: BannerDto[]) {
        localStorage.setItem(this.BANNER_KEY, JSON.stringify(banners))
    }


}

export default new BannerService()
