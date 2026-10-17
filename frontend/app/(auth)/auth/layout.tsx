
export default function AuthLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="h-full antialiased font-sans">
            {children}
        </div>
    );
}
