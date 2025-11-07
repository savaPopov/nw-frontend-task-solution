import { Button } from '@mui/joy'
import Add from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom';

export default function FAB() {
    const navigate = useNavigate();
    // function handleCreate() {
    //     navigate('/banners/create')
    // }
    return (
        <Button  onClick={() => navigate({ pathname: `/banners/create` })} style={{
            position: 'fixed',
            right: '72px',
            bottom: '32px',
            height: '72px',
            borderRadius: '50%',
        }} size="lg">
            <Add />
        </Button>
    )
}