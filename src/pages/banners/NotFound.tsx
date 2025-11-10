import { Box, Typography, Button, Container } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { WarningRounded } from '@mui/icons-material'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                gap: 3
            }}
        >
            <WarningRounded sx={{ fontSize: 64, color: 'neutral.500' }} />
            
            <Typography level="h1" fontSize="4rem" color="danger">
                404
            </Typography>
            
            <Typography level="h2" fontSize="xl">
                Page Not Found
            </Typography>
            
            <Typography level="body-md" color="neutral">
                The page you're looking for doesn't exist or has been moved.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                    variant="solid" 
                    color="primary" 
                    onClick={() => navigate('/')}
                >
                    Go Home
                </Button>
                <Button 
                    variant="outlined" 
                    color="neutral" 
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
            </Box>
        </Container>
    )
}