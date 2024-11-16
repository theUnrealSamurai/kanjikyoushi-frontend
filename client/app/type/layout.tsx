import NavBar from "@/components/NavBar";

export default function TypeLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <NavBar />
            <div className="flex-grow overflow-hidden">
                {children}
            </div>
        </div>
    );
}
