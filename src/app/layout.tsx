import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: 'Tiva OTC | Premium Digital Asset Terminal',
    description: 'Institutional-grade OTC trading platform on Canton Network.',
    icons: {
        icon: '/logo.png',
        apple: '/logo.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="min-h-screen antialiased selection:bg-primary/30 selection:text-white">
                {/* Subtle Overlay Effects */}
                <div className="scanlines" />

                <div className="relative flex min-h-screen flex-col z-10">
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
