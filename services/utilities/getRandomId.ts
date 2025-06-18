import uuid from 'react-native-uuid';

export function getRandomId(): string {
    return uuid.v4() as string;
}