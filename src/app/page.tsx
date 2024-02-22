import Image from 'next/image';

export default function Home() {
    return (
        <main className="tw-flex tw-min-h-screen tw-flex-col tw-items-center tw-justify-between tw-p-24">
            <h1 className="tw-text-yellow-500 tw-font-semibold tw-text-2xl tw-shadow-amber-400 tw-shadow-lg">
                YELLOW RESTAURANT - TRAINING PROJECT
            </h1>
            <div className="logo">
                <Image src="/images/vercel.svg" alt="Vercel Logo" className="dark:invert" width={100} height={24} priority />
            </div>
            <div className="exam">Render bài tập ở đây !</div>
        </main>
    );
}
