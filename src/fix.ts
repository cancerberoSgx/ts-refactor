import { getEnumKeys } from './misc';
import { CATEGORY } from './category';

export enum FIX {
    'organizeImports'='organizeImports'
}
export const fixes = getEnumKeys(FIX)

export interface Fix {
    categories: CATEGORY[]
    name: FIX
        
}