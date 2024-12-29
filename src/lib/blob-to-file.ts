export const blobToFile = async (url: string, fileName: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export async function convertAndAppendFiles(files: string[], form: FormData): Promise<void> {
  await Promise.all(
    files.map(async (file, index) => {
      let fileObj: Blob | null = null;

      // Check if the file is a Blob URL (string starting with "blob:")
      if (typeof file === 'string' && file.startsWith('blob:')) {
        // Fetch the Blob from the Blob URL

        const response = await fetch(file);

        fileObj = await response.blob(); // This fetches the Blob data

        // If you want to name the Blob when appending, you can do it here
        const newFileName = `image${index}`; // Create a unique file name
        const blobFile = new File([fileObj], newFileName, { type: fileObj.type });
        form.append('files', blobFile);
      } else {
        form.append('photos', file);
      }
    })
  );
}
