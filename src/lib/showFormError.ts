export default function (result: FormResult) {
    return typeof result.error! === "string" ? result.error : "Une erreur s'est produite";
}