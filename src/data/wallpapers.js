import macOSbackground from '@/assets/images/dock/macOSbackground.jpg';
import { useWallpaperStore } from '@/stores/wallpaperStore';

const wallpaperModalStore = useWallpaperStore();
const selectedBackground = wallpaperModalStore.getBackground();

export const wallpapers = [
    {
        label: 'Wallpaper 0',
        value: selectedBackground
    },
    {
        label: 'Wallpaper 1',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper1.jpg'
    },
    {
        label: 'Wallpaper 2',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper2.jpg'
    },
    {
        label: 'Wallpaper 3',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper3.png'
    },
    {
        label: 'Wallpaper 4',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper4.png'
    },
    {
        label: 'Wallpaper 5',
        value: macOSbackground
    },
    {
        label: 'Wallpaper 6',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper6.jpg'
    },
    {
        label: 'Wallpaper 7',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper7.png'
    },
    {
        label: 'Wallpaper 8',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper8.png'
    },
    {
        label: 'Wallpaper 9',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper9.png'
    },
    {
        label: 'Wallpaper 10',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper10.png'
    },
    {
        label: 'Wallpaper 11',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper11.png'
    },
    {
        label: 'Wallpaper 12',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper12.png'
    },
    {
        label: 'Wallpaper 13',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper13.jpg'
    },
    {
        label: 'Wallpaper 14',
        value: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper14.png'
    }
];

export default wallpapers;
