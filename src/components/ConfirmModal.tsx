import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import { Button, DialogActions, DialogContent, DialogTitle, ModalClose } from '@mui/joy'
import Divider from '@mui/joy/Divider'
import { WarningRounded } from '@mui/icons-material'

export default function ConfirmModal(props: {
    open: boolean
    onClose: () => void
    confirm?: () => void
    action: string
    confirmButtonText: string
}) {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <ModalDialog
                color="danger"
                variant="outlined"
            >
                <ModalClose />
                <DialogTitle>
                    <WarningRounded />
                    Confirmation
                </DialogTitle>
                <Divider />
                <DialogContent>Are you sure you want to {props.action}?</DialogContent>
                <DialogActions>
                    <Button
                        variant="solid"
                        onClick={() => {
                            props.onClose()
                            if (props.confirm) {
                                props.confirm()
                            }
                        }}
                    >
                        {props.confirmButtonText}
                    </Button>
                    <Button
                        variant="plain"
                        onClick={props.onClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}
