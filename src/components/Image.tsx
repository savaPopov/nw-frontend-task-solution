import { AspectRatio, Skeleton } from '@mui/joy'
import { useEffect, useState } from 'react'
import ImageService from '../services/image.service.ts'

export default function Image(props: {
    url?: string
}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [imageSrc, setImageSrc] = useState<string>()
//TODO add error handling
    useEffect(() => {
        if (props.url) {
            ImageService.fetchImage(props.url)
                .then((value) => {
                        if (value) {
                            setImageSrc(value)
                            setIsLoaded(true)
                        }
                    },
                )
        }
    }, [props])

    useEffect(() => {
        if (imageSrc) {
            return () => URL.revokeObjectURL(imageSrc)
        }
    }, [imageSrc])

    return (
        <AspectRatio
            ratio="2"
            objectFit="cover"
        >
            <Skeleton
                loading={!isLoaded}
                variant="overlay"
            >
                <img
                    src={imageSrc}
                    srcSet={`${imageSrc} 2x`}
                    style={{
                        ...(isLoaded ? {} : { visibility: 'hidden' }),
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    alt="Banner"
                    onLoad={() => setIsLoaded(true)}
                />
            </Skeleton>
        </AspectRatio>
    )
}
