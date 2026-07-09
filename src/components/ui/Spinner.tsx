export function Spinner({ full = true }: { full?: boolean }) {
    return (
        <div className={full ? "flex h-full min-h-[50vh] items-center justify-center" : "flex items-center justify-center p-4"}>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
    );
}