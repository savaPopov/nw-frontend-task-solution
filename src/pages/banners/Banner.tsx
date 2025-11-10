import {
    Grid,
    Sheet,
    Typography,
    Card,
    Box,
    Button,
    Divider,
    AspectRatio
} from '@mui/joy'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import { useToast } from '../../context/toast/toast.context.tsx'
import BannerService from '../../services/banner.service.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import ConfirmModal from '../../components/ConfirmModal.tsx'
import Image from '../../components/Image.tsx'

export default function Banner() {
    const { setPageData } = usePageData()
    const { id } = useParams()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [banner, setBanner] = useState<BannerDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    useEffect(() => {
        if (id) {
         
            BannerService.getBanner(id)
                .then(bannerData => {
                    if (bannerData) {
                        setBanner(bannerData)
                    }
                })
                .catch(error => {
                    console.error('Error loading banner:', error)
                    showToast('Failed to load banner', 'error')
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }

    }, [setPageData, id])

    const handleDelete = () => {

        setDeleteModalOpen(true)
    }

    const handleEdit = () => {
        navigate(`/banners/edit/${id}`)
    }

    const handleDeleteConfirm = async () => {
        if (!id) return

        try {
            await BannerService.deleteBanner(id)
            showToast('Banner deleted successfully', 'success')
            navigate('/banners')
        } catch (error) {
            console.error('Error deleting banner:', error)
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error'
            showToast(`Failed to delete banner: ${errorMessage}`, 'error')
        } finally {
            setDeleteModalOpen(false)
        }
    }



    return (
        <>
            <Grid container spacing={3}>

                <Grid xs={12} md={8}>
                    <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography level="h3" sx={{ mb: 3, fontWeight: 'lg' }}>
                            Banner Preview
                        </Typography>

                        <AspectRatio
                            ratio="16/9"
                            sx={{
                                borderRadius: 'md',
                                overflow: 'hidden',
                                bgcolor: 'background.level1'
                            }}
                        >

                            {banner?.imageUrl ? (
                                <Image url={banner.imageUrl} />
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        bgcolor: 'background.level2'
                                    }}
                                >
                                    <Typography level="body-md" color="neutral">
                                        No image available
                                    </Typography>
                                </Box>
                            )}
                        </AspectRatio>
                    </Card>
                </Grid>


                <Grid xs={12} md={4}>
                    <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography level="h3" sx={{ mb: 3, fontWeight: 'lg' }}>
                            Banner Details
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            <Box>
                                <Typography level="title-md" sx={{ mb: 1, fontWeight: 'lg' }}>
                                    Link URL
                                </Typography>
                                <Card variant="soft" sx={{ p: 2, bgcolor: 'background.level1' }}>
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            wordBreak: 'break-all',
                                            fontFamily: 'monospace'
                                        }}
                                    >

                                        {banner?.link}
                                    </Typography>
                                </Card>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography level="title-md" sx={{ mb: 1, fontWeight: 'lg' }}>
                                    Banner ImageUrl
                                </Typography>
                                <Card variant="soft" sx={{ p: 2, bgcolor: 'background.level1' }}>
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            wordBreak: 'break-all',
                                            fontFamily: 'monospace'
                                        }}
                                    >

                                        {banner?.imageUrl}
                                    </Typography>
                                </Card>
                            </Box>

                            <Divider />


                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography level="title-md" sx={{ fontWeight: 'lg' }}>
                                    Actions
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <Button
                                        variant="solid"
                                        color="primary"
                                        onClick={handleEdit}
                                        sx={{ flex: 1 }}
                                        size="lg"
                                    >
                                        Edit Banner
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="danger"
                                        onClick={handleDelete}
                                        sx={{ flex: 1 }}
                                        size="lg"
                                    >
                                        Delete Banner
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Card>

                    <Card variant="outlined" sx={{ p: 3, mt: 3 }}>
                        <Typography level="title-lg" sx={{ mb: 2, fontWeight: 'lg' }}>
                            Additional Information
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography level="body-sm" color="neutral">
                                    Banner ID:
                                </Typography>
                                <Typography level="body-sm" fontWeight="lg">
                                    {id}
                                </Typography>
                            </Box>

                        </Box>
                    </Card>
                </Grid>
            </Grid>


            <ConfirmModal
                open={deleteModalOpen}
                onClose={() =>
                    setDeleteModalOpen(false)
                }
                confirm={handleDeleteConfirm}
                action="delete this banner"
                confirmButtonText='Delete'
            />
        </>
    )
}