import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Button, Card, CardActions, CardOverflow, Grid, Skeleton, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import { Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Image from '../Image.tsx'

export default function BannerCard(props: { banner?: BannerDto; delete?: () => void }) {
    const navigate = useNavigate()

    const handleCardClick = () => {
        if (props.banner?.id) {
            navigate(`/banners/${props.banner.id}`)
        }
    }

    return (
        <Grid
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
        >
            <Card
                onClick={handleCardClick}
                sx={{
                    height: 400,
                    cursor: 'pointer',
                    // width: '100%'
                }}>
                <CardOverflow>
                    <Image url={props.banner?.imageUrl} />
                </CardOverflow>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            level="title-lg"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                            }}
                        >
                            <Skeleton
                                loading={!props.banner}
                                variant="text"
                                sx={{ width: '100%', height: '100%' }}
                            >
                                {props.banner?.link}
                            </Skeleton>
                        </Typography>
                    </Box>
                </Box>
                <CardActions>
                    <IconButton
                        variant="outlined"
                        size="sm"
                        sx={{ width: '20%', alignSelf: 'center' }}
                        onClick={(e) => {
                            e.stopPropagation()
                            props.delete?.();
                        }}
                    >
                        <Delete />
                    </IconButton>
                    <Button
                        variant="solid"
                        type={'button'}
                        size="md"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate({ pathname: `/banners/edit/${props.banner!.id}` })
                        }}
                        // onClick={() => navigate({ pathname: `/banners/edit/${props.banner!.id}` })}
                        color="primary"
                        sx={{ width: '75%', alignSelf: 'center', fontWeight: 600 }}
                    >
                        Edit
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}
