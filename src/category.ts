import { getEnumKeys } from './misc';

export enum CATEGORY {
    'fix'='fix', 'convert'='convert', 'move'='move', 'rename'='rename', 'remove'='remove'
} 

export const categories = getEnumKeys(CATEGORY)


