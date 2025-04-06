import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer'; 
import { supabase } from "../lib/supabase";
import { supabaseUrl } from '../constants';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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
            return 'video/mp4';
        default:
            throw new Error('Unsupported file type');
    }
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        // Generate file path with correct extension
        let fileName = getFilePath(folderName, fileUri);

        // Read file as Base64
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        // Decode Base64 to ArrayBuffer
        const imageData = decode(fileBase64);

        // Determine content type
        const contentType = getContentType(fileUri);

        // Upload to Supabase
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

        // console.log('Supabase upload data:', data);
        return { success: true, data: data.path };

    } catch (error) {
        console.error('Error during upload process:', error);
        return { success: false, msg: error.message };
    }
};

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage? '.png': '.mp4'}`;
}