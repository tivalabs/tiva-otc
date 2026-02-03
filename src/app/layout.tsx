import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: 'Tiva OTC | Canton Network Trading Terminal',
    description: 'High-performance OTC trading terminal powered by Canton Network and Daml smart contracts.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background antialiased">
                <div className="relative flex min-h-screen flex-col">
                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
