import AuthCard from "@/components/AuthCard"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import { Suspense } from "react"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({
    params
}: {
    params: Promise<{ path: string }>
}) {
    const { path } = await params

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white-pure">Loading...</div>}>
            <AuthCard path={path} />
        </Suspense>
    )
}