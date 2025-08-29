const AdminFooter = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full h-12 bg-gray-100 border-t border-gray-300 dark:bg-gray-800">
            <div className="text-center p-3 text-gray-600 text-sm">
                &copy; {currentYear} Your Company. All rights reserved.
            </div>
        </footer>
    )
}

export default AdminFooter