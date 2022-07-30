import { UPLOADED_FOLDER } from '@functions/constants';

export const getObjectName = (filename: string) => `${UPLOADED_FOLDER}/${filename}`;
