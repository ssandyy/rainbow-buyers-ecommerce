const AdminTopbar = () => {
    return (
        <div className="flex items-center justify-between h-16 w-full bg-gray-400 border-b px-6 shrink-0">
            <h2 className="font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
                {/* Add any topbar actions here */}
                <span className="text-sm text-gray-600">Welcome, Admin</span>
            </div>
        </div>
    )
}

export default AdminTopbar