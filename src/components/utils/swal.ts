import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const toast = MySwal.mixin({
    toast: true,
    position: "top-end",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
});

export { Swal, MySwal, toast };
