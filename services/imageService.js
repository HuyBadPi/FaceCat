import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer'; 
import { supabase } from "../lib/supabase";
import { supabaseUrl } from '../constants';

export const getUserImageSrc = imagePath => {
    if(imagePath) {
        return getSupabaseFileUrl(imagePath);
    }else{
        return require('../assets/images/emoji4.png');
    }
} 

export const getSupabaseFileUrl = filePath => {
    if(filePath) {
        return {uri: `${supabaseUrl}/storage/v1/object/public/upload/${filePath}`}
    }
    return null;
}

const getContentType = (fileUri) => {
    const extension = fileUri.split('.').pop().toLowerCase();
    switch (extension) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'mp4':
        case 'mov':
            return 'video/mp4';
        default:
            throw new Error('Unsupported file type');
    }
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, fileUri);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });
        const imageData = decode(fileBase64);
        const contentType = getContentType(fileUri);

        let { data, error } = await supabase
            .storage
            .from('upload') // Ensure this matches your bucket name
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false,
                contentType: contentType,
            });
        if (error) {
            console.error('Supabase upload error:', error);
            return { success: false, msg: error.message };
        }
        return { success: true, data: data.path };

    } catch (error) {
        console.error('Error during upload process:', error);
        return { success: false, msg: error.message };
    }
};


export const downloadFile = async (url) => {
    try {
        const { uri } = await FileSystem.downloadAsync(
            url,
            getLocalFilePath(url)
        );
        return uri;
    } catch (error) {
        return null;
    }
}

export const getLocalFilePath = filePath => {
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}

export const getFilePath = (folderName, fileUri) => {
    const extension = fileUri.split('.').pop().toLowerCase(); // Lấy phần mở rộng từ fileUri
    return `/${folderName}/${(new Date()).getTime()}.${extension}`;
};