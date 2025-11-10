import { Grid, Sheet, Typography, Card, Box, FormControl, FormLabel, Input, Button, FormHelperText, Alert, Snackbar } from '@mui/joy'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import BannerService from '../../services/banner.service.ts'
import { useForm } from '../../hooks/useForm.ts'
import { useBannerFormValidation } from '../../hooks/useBannerFormValidation.ts'
import { useToast } from '../../context/toast/toast.context.tsx'
import ConfirmModal from '../../components/ConfirmModal.tsx'


export default function BannerForm() {
    const { setPageData } = usePageData()
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id
    const [submitError, setSubmitError] = useState('')
    const { showToast } = useToast();
    const [modalOpen, setModalOpen] = useState(false)
    const [formDataToSubmit, setFormDataToSubmit] = useState<BannerDto | null>(null)

    const initialValues: BannerDto = {
        link: '',
        imageUrl: ''
    }


    const { values, changeHandler, submitHandler, setValue } = useForm<BannerDto>(initialValues, handleSubmit)
    const { errors, touched, handleBlur, markAllTouched, isFormValid } = useBannerFormValidation(values)

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setPageData({
            title: isEditing ? 'Banners > Edit' : 'Banners > Create New'
        })
    }, [setPageData, isEditing])


    useEffect(() => {
        if (isEditing && id) {
            BannerService.getBanner(id).then(banner => {
                if (banner) {
                    setValue("imageUrl", banner.imageUrl)
                    setValue("link", banner.link)
                }
            })
        }
    }, [isEditing, id])

    async function handleSubmit(formData: BannerDto) {
        console.log('Form data to submit:', formData)

        const formErrors = markAllTouched()
        if (Object.values(formErrors).some(error => error)) {
            showToast('Please fix the form errors before submitting', 'error')
            return
        }


        if (isEditing) {
            setFormDataToSubmit(formData)
            setModalOpen(true)
        } else {

            await submitFormData(formData)
        }
    }

    async function submitFormData(formData: BannerDto) {
        setLoading(true)
        setSubmitError('')

        try {
            if (isEditing) {
                await BannerService.updateBanner(id!, formData)
                showToast('Banner updated successfully', 'success')
                navigate('/banners')
            } else {
                await BannerService.createBanner(formData)
                showToast('Banner created successfully', 'success')
                navigate("/banners")
            }
        } catch (err) {
            console.error('Error saving banner:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
            setSubmitError(`Failed to save banner: ${errorMessage}`)
            showToast(`Failed to save banner: ${errorMessage}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = async () => {
        if (formDataToSubmit) {
            await submitFormData(formDataToSubmit)
        }
        setModalOpen(false)
        setFormDataToSubmit(null)
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setFormDataToSubmit(null)
    }


    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Sheet sx={{ maxWidth: 600, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography level="h2">
                            {isEditing ? 'Edit Banner' : 'Create New Banner'}
                        </Typography>

                        {submitError && (
                            <Alert color="danger" variant="soft">
                                {submitError}
                            </Alert>
                        )}

                        {/* <Alert color="danger" variant="soft">
                    Failed to load banner data
                    </Alert> */}

                        <Card>
                            <form onSubmit={submitHandler}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <FormControl required>
                                        <FormLabel>Link URL</FormLabel>
                                        <Input
                                            id="link"
                                            name="link"
                                            type="url"
                                            placeholder="https://example.com/path"
                                            value={values.link}
                                            onChange={changeHandler}
                                            onBlur={handleBlur}
                                            disabled={loading}
                                            error={touched.link && !!errors.link}
                                            required
                                        />

                                        {touched.link && errors.link && (
                                            <FormHelperText>
                                                {errors.link}
                                            </FormHelperText>
                                        )}

                                    </FormControl>


                                    <FormControl required>
                                        <FormLabel>Image URL</FormLabel>
                                        <Input
                                            id="imageUrl"
                                            name="imageUrl"
                                            type="url"
                                            placeholder="https://picsum.photos/600/300"
                                            value={values.imageUrl}
                                            onChange={changeHandler}
                                            onBlur={handleBlur}
                                            disabled={loading}
                                            error={touched.imageUrl && !!errors.imageUrl}
                                            required
                                        />

                                        {touched.imageUrl && errors.imageUrl && (
                                            <FormHelperText>
                                                {errors.imageUrl}
                                            </FormHelperText>
                                        )}

                                    </FormControl>


                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button variant="outlined" onClick={() => navigate('/banners')} disabled={loading}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" loading={loading} disabled={!isFormValid() || loading} >
                                            {isEditing ? 'Update Banner' : 'Create Banner'}
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </Card>
                    </Sheet>
                </Grid>
            </Grid>


            <ConfirmModal
                open={modalOpen}
                onClose={handleModalClose}
                confirm={handleConfirm}
                action="update this banner"
                confirmButtonText='Update'
            />
        </>
    )
}