import { UPLOADED_FOLDER } from './constants';

export const getObjectName = (filename: string) => `${UPLOADED_FOLDER}/${filename}`;
