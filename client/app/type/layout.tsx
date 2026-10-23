import NavBar from "@/components/NavBar";

export default function TypeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <NavBar />
            <div className="min-h-0 flex-grow overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
