import { httpClient } from '@/lib/http';
import { HOST } from './constants';
import type { GetImageKitSignatureResponse } from '@/types/imageKit';

export async function getImageKitSignature(): Promise<GetImageKitSignatureResponse> {
  const url = `${HOST}/v1/imagekit/signature`;

  return httpClient<GetImageKitSignatureResponse>(url, {
    method: 'GET',
  });
}

export async function uploadToImageKit(file: File): Promise<string> {
  const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';
  const signatureResponse = await getImageKitSignature();

  const { expire, publicKey, signature, token } = signatureResponse.data;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('expire', String(expire));
  formData.append('publicKey', publicKey);
  formData.append('signature', signature);
  formData.append('token', token);

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }

  const uploadData = await uploadResponse.json();

  return uploadData.url;
}
