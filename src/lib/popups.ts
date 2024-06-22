import Swal from "sweetalert2";

export async function confirm(text: string): Promise<boolean> {
    return (await Swal.fire({
        text,
        title: "Confirmation",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Confirmer",
    })).isConfirmed;
}

export async function alert(text: string): Promise<void> {
    await Swal.fire({
        text,
        title: "Attention !",
        icon: "warning",
    });
}