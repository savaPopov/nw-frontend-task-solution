import BannerService from '../../services/banner.service.ts'
import ScrollableCards from '../../components/ScrollableCards.tsx'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerCard from '../../components/banner/BannerCard.tsx'
import FAB from '../../components/FAB.tsx'
import { useToast } from '../../context/toast/toast.context.tsx'
import ConfirmModal from '../../components/ConfirmModal.tsx'

export default function Banners() {
    const { setPageData } = usePageData()
    const [modalOpen, setModalOpen] = useState(false)
    const [bannerToDelete, setBannerToDelete] = useState<{ id: string, deleteItem: (id: string) => void } | null>(null)
    const { showToast } = useToast();

    useEffect(() => {
        setPageData({ title: 'Banners' })
    }, [setPageData])

    const handleDelete = async () => {
        if (bannerToDelete) {
            try {

                await BannerService.deleteBanner(bannerToDelete.id)
                console.log(`banner to delete id-> ${bannerToDelete.id}`)
                bannerToDelete.deleteItem(bannerToDelete.id)

                showToast(
                    'Banner deleted successfully',
                    'success'
                )

                setBannerToDelete(null)
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Unknown error'

                showToast(
                    `Failed to delete banner: ${errorMessage}`,
                    'error'
                )
            }
        }
    }

    return (
        <>
            <ScrollableCards
                loadMore={page => BannerService.getBanners(page)}
                mapCard={(banner, deleteItem) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        delete={() => {
                            setBannerToDelete({ id: banner.id!, deleteItem })
                            setModalOpen(true)
                        }}
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={'skeleton-' + i} />}
            />
            <FAB />
            <ConfirmModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setBannerToDelete(null)
                }}
                confirm={handleDelete}
                action="delete this banner"
                confirmButtonText='Delete'
            />
        </>
    )
}
