import Tts from 'react-native-tts';

// 'bn-IN'
const lang = 'en-US';

const options = {
    androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC'
    }
}

Tts.setDefaultLanguage(lang);
Tts.setDucking(true);

export const readText = (message) => {
    return new Promise((resolve, reject) => {
        Tts.getInitStatus().then(() => {
            Tts.speak(message, options);

            Tts.addEventListener('tts-finish', (event) => {
                Tts.removeAllListeners('tts-finish');
                resolve(event);
            });
        }, (error) => reject(error));
    });
}