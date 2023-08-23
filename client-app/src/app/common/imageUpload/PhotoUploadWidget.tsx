import React, { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropdone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    uploadPhoto: (file: Blob) => void;
    uploading: boolean;
}

export default function PhotoUploadWidget({ uploadPhoto, uploading }: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>()

    function OnCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((f: any) => {
                URL.revokeObjectURL(f.preview);
            });
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header color="teal" sub content='Step 1 - Add Photo' />
                <PhotoWidgetDropdone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header color="teal" sub content='Step 2 - Resize Photo' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header color="teal" sub content='Step 3 - Preview and Upload' />
                {files && files.length > 0 &&
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group widths={2}>
                            <Button onClick={OnCrop} loading={uploading} positive icon='check' />
                            <Button onClick={() => setFiles([])} disabled={uploading} icon='close' />
                        </Button.Group>
                    </>}

            </Grid.Column>
        </Grid>
    )
}