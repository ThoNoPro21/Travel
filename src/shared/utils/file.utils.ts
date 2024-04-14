export function blobToFile(theBlob: Blob, fileName: string): File {
    return new File([theBlob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function saveFileOnUserDevice(file: File | Blob | MediaSource, fileName: string) {
    const link = document.createElement('a');
    const fileUrl = URL.createObjectURL(file);
    link.href = fileUrl;
    link.download = fileName;
    link.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
    }, 0);
}

export function b64toBlob(b64DataRaw: string, contentTypeInput?: string, sliceSizeInput?: number): Blob {
    // contentTypeInput=image/png ; sliceSize=512 data:image/png;base64,
    const contentType = contentTypeInput ?? 'image/jpeg';
    const sliceSize = sliceSizeInput ?? 512;
    const byteCharacters = atob(decodeURIComponent(b64DataRaw.replace(/^data:.+;base64,/, '')));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray as never);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export function getFileExtension(filename: any) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
}
