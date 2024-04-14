//import { Nunito_Sans } from 'next/font/google';
import localFont from 'next/font/local';

// define your variable fonts
// const nunito = Nunito_Sans({
//     subsets: ['latin'],
//     variable: '--font-nunito',
// });

// define a custom local font where GreatVibes-Regular.ttf is stored in the styles folder
const passionSansPDag = localFont({
    src: 'fonts/PassionSansPDag-Regular.woff2',
    variable: '--font-passion-ag',
});
const passionSansPDae = localFont({
    src: 'fonts/PassionSansPDae-Book.woff2',
    variable: '--font-passion-ae',
});
const passionSansPDai = localFont({
    src: 'fonts/PassionSansPDai-SemiBold.woff2',
    variable: '--font-passion-ai',
});

const fonts = { passionSansPDag, passionSansPDae, passionSansPDai };
export default fonts;
//export { nunito, passionSansPDag, passionSansPDae, passionSansPDai };
